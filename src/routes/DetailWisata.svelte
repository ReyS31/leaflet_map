<script>
  import { onMount } from "svelte";
  import bannerPng2 from "../assets/EventBanner-2.png";

  export let id = "7a6ee9a7-ccb3-4f2a-8b5e-ff5c97ade700";

  let data = {
    name: "test",
    location: {
      coordinates: [0, 0],
    },
  };

  const baseUrl = "https://spicy-rocks-melt-quietly.a276.dcdg.xyz";

  // proses ambil data
  async function getData() {
    let url = `${baseUrl}/places/${id}`;

    fetch(url, {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((res) => {
        data = res.data;
      });
  }

  onMount(async () => {
    await getData();
  });

  $: console.log("test" + id);
</script>

<div class="m-8">
  <div class="flex">
    <img style="border-radius:16px" class="w-3/4" src={bannerPng2} />
    <div class="flex flex-col text-center w-1/4">
      <h2 class="h2 mb-3">{data.name}</h2>
      <h4 class="h4 mb-3">{data.category}</h4>
      <p>
        {data.address}
      </p>
    </div>
  </div>
  <!-- Bagian bawah konten -->
  <div class="flex flex-col">
    <div class="row-span-2">
      <h2 class="h2">Sekilas Informasi Tentang Tempat Wisata</h2>
    </div>
    <!-- <div class="col-span-2"> -->
    <div>
      <span class="badge variant-filled">Jam Buka</span>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${data.location.coordinates[1]}%2C${data.location.coordinates[0]}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="badge variant-filled">Petunjuk Arah</span></a
      >
    </div>
    <!-- </div> -->

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
