<script>
  import { onMount } from "svelte";
  import { Router, Link, Route } from "svelte-routing";

  import bannerPng2 from "../assets/EventBanner-2.png";

  // Lembuswana Mall Geolocation
  let initialView = [-0.4749137205300664, 117.14719490690157];

  let places = [];
  let rekreasi = [];
  let budaya = [];
  let detail = [];

  const baseUrl = "https://spicy-rocks-melt-quietly.a276.dcdg.xyz";

  // proses ambil data Rekreasi
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

  // proses ambil data Budayaa
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
    await getRekreasi();
    await getBudaya();
  });
</script>

<div class="mx-8">
  <div class="grid grid-rows-2 grid-flow-col gap-4">
    <div class="row-span-3">
      <!-- Banner Bottom -->
      <div class="card p-8 px-3 py-3 mx-3 my-3 m-8">
        <img style="border-radius:16px" width="100%" src={bannerPng2} />
      </div>
    </div>
    <div class="col-span-2">
      {#each budaya || rekreasi as place}
        <h2 class="h2">{place.name}</h2>
      {/each}
    </div>
    <div class="row-span-2 col-span-2">
      <span class="badge variant-filled">Kategori Wisata</span>
      <span class="badge variant-filled">Alamat Tempat Wisata</span>
    </div>
  </div>
  <!-- Bagian bawah konten -->
  <div class="grid grid-rows-2 grid-flow-col gap-4">
    <div class="row-span-3">
      <h2 class="h2">Sekilas Informasi Tentang Tempat Wisata</h2>
    </div>
    <div class="col-span-2">
      <span class="badge variant-filled">Jam Buka</span>
      <span class="badge variant-filled">Petunjuk Arah</span>
    </div>

    <!-- <div class="row-span-2 col-span-2">ssss</div> -->
  </div>
  <div class="grid grid-rows-1 mb-12">
    <div class="row-span-3">
      <p>
        Sekilas Informasi Mengenai Tempat Wisata Sekilas Informasi Mengenai
        Tempat Wisata Sekilas Informasi Mengenai Tempat Wisata Sekilas Informasi
        Mengenai Tempat Wisata Sekilas Informasi Mengenai Tempat Wisata Sekilas
        Informasi Mengenai Tempat Wisata Sekilas Informasi Mengenai Tempat
        Wisata Sekilas Informasi Mengenai Tempat Wisata Sekilas Informasi
        Mengenai Tempat Wisata Sekilas Informasi Mengenai Tempat Wisata Sekilas
        Informasi Mengenai Tempat Wisata Sekilas Informasi Mengenai Tempat
        Wisata .
      </p>
    </div>
  </div>
</div>
