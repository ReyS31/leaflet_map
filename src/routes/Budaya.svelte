<script>
  import { onMount } from "svelte";
  import bannerPng3 from "../assets/EventBanner-3.png";
  import wisataPng1 from "../assets/Wisata-01.png";
  import wisataPng2 from "../assets/Wisata-02.png";
  import wisataPng3 from "../assets/Wisata-03.png";
  import { Router, Link, Route } from "svelte-routing";

  const baseUrl = "https://spicy-rocks-melt-quietly.a276.dcdg.xyz";

  // Lembuswana Mall Geolocation
  let initialView = [-0.4749137205300664, 117.14719490690157];

  let places = [];
  let budaya = [];

  async function getBudaya() {
    let url = `${baseUrl}/places?lat=${initialView[0]}&long=${initialView[1]}&range=10&page=1`;

    url += `&category=budaya`;

    fetch(url, {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((res) => {
        budaya = res.data.places;
      });
  }

  onMount(async () => {
    await getBudaya();
  });
</script>

<!-- Banner Top -->
<div class="card p-12 px-3 py-3 mx-3 my-3 m-12">
  <img style="border-radius:16px" width="100%" src={bannerPng3} />
</div>

<!-- Judul halaman -->
<h1 class="h1 py-4 px-6">Rekomendasi Tempat Wisata Kerajinan dan Kebudayaan</h1>

<div
  class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-5"
>
  {#each budaya as place}
    <Link to="/detailWisata">
      <div class="snap-start shrink-0 card py-5 w-40 md:w-80 text-center">
        {place.name}
        <img
          style="border-radius:16px"
          width="100%"
          src={wisataPng1}
          alt="Tempat Wisata"
        />
      </div>
    </Link>
  {/each}
</div>

<div
  class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-5"
>
  {#each budaya as place}
    <Link to="/detailWisata">
      <div class="snap-start shrink-0 card py-5 w-40 md:w-80 text-center">
        {place.name}
        <img
          style="border-radius:16px"
          width="100%"
          src={wisataPng2}
          alt="Tempat Wisata"
        />
      </div>
    </Link>
  {/each}
</div>

<div
  class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-5"
>
  {#each budaya as place}
    <Link to="/detailWisata">
      <div class="snap-start shrink-0 card py-5 w-40 md:w-80 text-center">
        {place.name}
        <img
          style="border-radius:16px"
          width="100%"
          src={wisataPng3}
          alt="Tempat Wisata"
        />
      </div>
    </Link>
  {/each}
</div>
