<script>
  import { onMount } from "svelte";
  import bannerPng4 from "../assets/EventBanner-1.png";
  import { Router, Link, Route } from "svelte-routing";

  import wisataPng1 from "../assets/Wisata-01.png";
  import wisataPng2 from "../assets/Wisata-02.png";
  import wisataPng3 from "../assets/Wisata-03.png";

  const baseUrl = "https://spicy-rocks-melt-quietly.a276.dcdg.xyz";

  // Lembuswana Mall Geolocation
  let initialView = [-0.4749137205300664, 117.14719490690157];

  let places = [];
  let rekreasi = [];

  async function getRekreasi() {
    let url = `${baseUrl}/places?lat=${initialView[0]}&long=${initialView[1]}&range=10&page=1`;

    url += `&category=tempat_rekreasi`;

    fetch(url, {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((res) => {
        rekreasi = res.data.places;
      });
  }

  onMount(async () => {
    await getRekreasi();
  });
</script>

<!-- Banner Top -->
<div class="card p-12 px-3 py-3 mx-3 my-3 m-12">
  <img style="border-radius:16px" width="100%" src={bannerPng4} />
</div>

<!-- Judul halaman -->
<h1 class="h1 py-4 px-6">Rekomendasi Tempat Rekreasi</h1>

<div
  class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 pt-10"
>
  {#each rekreasi as place}
    <Link to="/detailWisata">
      <div class="snap-start shrink-0 card py-5 w-40 md:w-80 text-center">
        {place.name}
      </div>
      <img
        style="border-radius:16px"
        width="100%"
        src={wisataPng1}
        alt="Tempat Wisata"
      />
    </Link>
  {/each}
</div>

<div
  class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 pt-10"
>
  {#each rekreasi as place}
    <Link to="/detailWisata">
      <div class="snap-start shrink-0 card py-5 w-40 md:w-80 text-center">
        {place.name}
      </div>
      <img
        style="border-radius:16px"
        width="100%"
        src={wisataPng3}
        alt="Tempat Wisata"
      />
    </Link>
  {/each}
</div>

<div
  class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 pt-10"
>
  {#each rekreasi as place}
    <Link to="/detailWisata">
      <div class="snap-start shrink-0 card py-5 w-40 md:w-80 text-center">
        {place.name}
      </div>
      <img
        style="border-radius:16px"
        width="100%"
        src={wisataPng2}
        alt="Tempat Wisata"
      />
    </Link>
  {/each}
</div>
