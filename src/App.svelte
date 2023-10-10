<script>
  /*
	This is an example of using Svelte features with Leaflet. Original blog post here: https://imfeld.dev/writing/leaflet_with_svelte
	
	The toolbar and the marker popups are both implemented by embedding Svelte components inside Leaflet elements. The marker and lines are toggled by updating the map from reactive statements.
	
	Any questions? Ask me at dimfeld on Twitter!
	
	Thanks to heroicons.dev for all the icons used here.
	*/
  import { onMount } from "svelte";
  import L from "leaflet";

  let map;
  let geoLayer;
  let currPosLayer;

  let places = [];
  let geo = [];
  let categories = [];

  // Lembuswana Mall Geolocation
  let initialView = [-0.4749137205300664, 117.14719490690157];

  let page = 1;
  let currentPage = 1;

  let mounted = false;
  let change = false;

  let category = { name: "All", icon: "all" };
  let selectedCategory = { name: "All", icon: "all" };

  async function getPlaces() {
    let url = `${process.env.BASE_URL}/places?lat=${initialView[0]}&long=${initialView[1]}&range=10&page=${currentPage}`;
    if (category.icon !== "all") {
      url += `&category=${category.icon}`;
    }
    return fetch(url, {
      method: "GET",
      redirect: "follow",
    }).then((response) => response.json());
  }

  async function toCurrentLocation() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    async function success(pos) {
      const crd = pos.coords;

      initialView = [crd.latitude, crd.longitude];
      console.log(initialView);

      categories = await fetch(`${process.env.BASE_URL}/categories`, {
        method: "GET",
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((res) => res.data);

      getPlaces()
        .then((result) => {
          places = result.data.places;
          geo = result.data.geo;
        })
        .catch((error) => console.log("error", error));

      mounted = true;
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  onMount(async () => {
    await toCurrentLocation();
  });

  function createMap(container) {
    let m = L.map(container, { preferCanvas: true }).setView(initialView, 12);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
        subdomains: "abcd",
        maxZoom: 164,
      }
    ).addTo(m);
    return m;
  }

  function mapAction(container) {
    map = createMap(container);
    map.setView(initialView, 12);
    currPosLayer = L.marker(initialView).bindPopup("Lokasi Saat Ini");
    map.setZoom(12);
    return {
      destroy: () => {
        map.remove();
        map = null;
      },
    };
  }

  // We could do these in the toolbar's click handler but this is an example
  // of modifying the map with reactive syntax.
  $: if (geo.length > 0 && map) {
    if (geoLayer) {
      map.removeLayer(geoLayer);
    }

    geoLayer = L.geoJSON(geo).bindPopup(function (layer) {
      return layer.feature.geometry.properties.name;
    });

    geoLayer.addTo(map);
  }

  $: if (currPosLayer) {
    if (currPosLayer) {
      map.removeLayer(currPosLayer);
    }

    currPosLayer = L.marker(initialView).bindPopup("Lokasi Saat Ini");

    currPosLayer.addTo(map).openPopup();
  }

  $: if (change && geo.length > 0 && map && mounted) {
    if (category != selectedCategory) {
      page = 1;
      category = selectedCategory;
    }

    change = false;
    getPlaces()
      .then((result) => {
        if (result.data.geo.length > 1) {
          places = result.data.places;
          geo = result.data.geo;
          page = currentPage;
          category = selectedCategory;
        } else {
          currentPage = page;
        }
      })
      .catch((error) => console.log("error", error));
  }

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }
</script>

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
  crossorigin=""
/>

<svelte:window on:resize={resizeMap} />

<div class="map" style="height:750px;width:100%" use:mapAction />
<button
  on:click={() => {
    if (page > 1) {
      currentPage--;
      change = true;
    }
  }}
>
  Prev
</button>
Page: {page}
<button
  on:click={() => {
    if (page === currentPage) {
      currentPage++;
      change = true;
    }
  }}
>
  Next
</button>
Current: {category.name}
<button
  on:click={async () => {
    await toCurrentLocation();
  }}
>
  Current Pos
</button>
<br />
<div style="margin-top: 10px;">
  <button
    style="margin-right: 12px;"
    on:click={() => {
      selectedCategory = { name: "All", icon: "all" };
      change = true;
    }}>All</button
  >
  {#each categories as ctg}
    <button
      style="margin-right: 12px;"
      on:click={() => {
        selectedCategory = ctg;
        change = true;
      }}>{ctg.name}</button
    >
  {/each}
</div>

<style>
  .map :global(.marker-text) {
    width: 100%;
    text-align: center;
    font-weight: 600;
    background-color: #444;
    color: #eee;
    border-radius: 0.5rem;
  }

  .map :global(.map-marker) {
    width: 30px;
    transform: translateX(-50%) translateY(-25%);
  }
</style>
