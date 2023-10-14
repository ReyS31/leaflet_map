<script>
  /*
	This is an example of using Svelte features with Leaflet. Original blog post here: https://imfeld.dev/writing/leaflet_with_svelte
	
	The toolbar and the marker popups are both implemented by embedding Svelte components inside Leaflet elements. The marker and lines are toggled by updating the map from reactive statements.
	
	Any questions? Ask me at dimfeld on Twitter!
	
	Thanks to heroicons.dev for all the icons used here.
	*/

  import locationPng from "./assets/location.png";
  import bannerPng from "./assets/EventBanner-1.png";
  import bannerPng2 from "./assets/EventBanner-2.png";
  import arrowRight from "./assets/icon/Arrow-Right.png";
  import arrowLeft from "./assets/icon/Arrow-Left.png";
  import { onMount } from "svelte";
  import L from "leaflet";
  import { AppBar } from "@skeletonlabs/skeleton";
  import { Router, Link, Route } from "svelte-routing";

  const baseUrl = "https://spicy-rocks-melt-quietly.a276.dcdg.xyz";

  const myIcon = L.icon({
    iconUrl: locationPng,
    iconSize: [40, 40],
    popupAnchor: [0, -25],
  });

  let map;
  let geoLayer;
  let currPosLayer;

  let places = [];
  let hotels = [];
  let totalPage = 0;
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
    let url = `${baseUrl}/places?lat=${initialView[0]}&long=${initialView[1]}&range=10&page=${currentPage}`;
    if (category.icon !== "all") {
      url += `&category=${category.icon}`;
    }
    return fetch(url, {
      method: "GET",
      redirect: "follow",
    }).then((response) => response.json());
  }

  async function getHotels() {
    let url = `${baseUrl}/places?lat=${initialView[0]}&long=${initialView[1]}&range=10&page=1`;

    url += `&category=hotel`;

    fetch(url, {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((res) => {
        hotels = res.data.places;
      });
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

      categories = await fetch(`${baseUrl}/categories`, {
        method: "GET",
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((res) => res.data);

      getPlaces()
        .then((result) => {
          places = result.data.places;
          geo = result.data.geo;
          totalPage = Math.ceil(result.data.total / 25);
        })
        .catch((error) => console.log("error", error));

      getHotels();

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
    let m = L.map(container, { preferCanvas: true }).setView(initialView, 4);
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
    map.setView(initialView, 4);
    currPosLayer = L.marker(initialView, { icon: myIcon }).bindPopup(
      "Lokasi Saat Ini"
    );

    map.flyTo(initialView, 13);
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

    currPosLayer = L.marker(initialView, { icon: myIcon }).bindPopup(
      "Lokasi Saat Ini"
    );

    currPosLayer.addTo(map).openPopup();
  }

  $: if (change && geo.length > 0 && map && mounted) {
    if (category.name != selectedCategory.name) {
      currentPage = 1;
      category = selectedCategory;
    }
    change = false;
    getPlaces()
      .then((result) => {
        if (result.data.geo.length > 0) {
          places = result.data.places;
          geo = result.data.geo;
          page = currentPage;
          category = selectedCategory;
          totalPage = Math.ceil(result.data.total / 25);
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

  export let url = "";
</script>

<div />
<div class="card p-12 px-3 py-3 mx-3 my-3 m-12">
  <img style="border-radius:16px" width="100%" src={bannerPng} />
</div>

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
  crossorigin=""
/>

<!-- <AppBar gridColumns="grid-cols-3">
  <Router {url}>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/budaya">Jelajah Budaya</Link>
      <Link to="/rekreasi">Tempat Rekreasi</Link>
    </nav>
  </Router>
</AppBar> -->

<svelte:window on:resize={resizeMap} />
<div class="card p-4">
  <div class="map" style="height:500px; width:100%" use:mapAction />
</div>
<button
  on:click={() => {
    if (page > 1) {
      currentPage--;
      change = true;
    }
  }}
>
  <img src={arrowLeft} width="24em" alt="" />
</button>
Page: {page}/{totalPage}
<button
  on:click={() => {
    if (page === currentPage) {
      currentPage++;
      change = true;
    }
  }}
>
  <img src={arrowRight} width="24em" alt="" />
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

<br />
<h1 class="h1 py-4 px-6">Kategori Tempat Wisata</h1>

<div style="margin-top: 10px;">
  <button
    style="margin-right: 12px;"
    class={selectedCategory.icon === "all" ? "btn-active" : ""}
    on:click={() => {
      selectedCategory = { name: "All", icon: "all" };
      change = true;
    }}>All</button
  >
  {#each categories as ctg}
    <button
      style="margin-right: 12px;"
      class={selectedCategory.icon === ctg.icon ? "btn-active" : ""}
      on:click={() => {
        selectedCategory = ctg;
        change = true;
      }}>{ctg.name}</button
    >
  {/each}
</div>

<div
  class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-10"
>
  {#each places as place}
    <div class="snap-start shrink-0 card py-20 w-40 md:w-80 text-center">
      {place.name}
    </div>
  {/each}
</div>

<h1 class="h1 py-4 px-6">Rekomendasi Tempat Wisata</h1>
<div
  class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-10"
>
  {#each places as place}
    <div class="snap-start shrink-0 card py-40 w-40 md:w-80 text-center">
      {place.name}
    </div>
  {/each}
</div>

<h1 class="h1 py-4 px-6">Hotel & Penginapan</h1>
<div
  class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-10"
>
  {#each hotels as hotel}
    <div class="snap-start shrink-0 card py-40 w-40 md:w-80 text-center">
      {hotel.name}
    </div>
  {/each}
</div>

<!-- Banner Bottom -->
<div class="card p-12 px-3 py-3 mx-3 my-3 m-12">
  <img style="border-radius:16px" width="100%" src={bannerPng2} />
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
