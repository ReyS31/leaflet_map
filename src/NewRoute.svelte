<!-- App.svelte -->
<script>
  import { Router, Link, Route } from "svelte-routing";
  import App from "./App.svelte";
  import { LightSwitch } from "@skeletonlabs/skeleton";
  // import About from "./About.svelte";
  import logoPng from "./assets/SiniLeh-Logo.png";
  import Rekreasi from "./routes/Rekreasi.svelte";
  import Budaya from "./routes/Budaya.svelte";
  import { AppBar, AppShell } from "@skeletonlabs/skeleton";
  import DetailWisata from "./routes/DetailWisata.svelte";

  export let url = "";
</script>

<Router {url}>
  <AppShell>
    <AppBar
      gridColumns="grid-cols-3"
      slotDefault="place-self-lead"
      slotTrail="place-self-end"
    >
      <svelte:fragment slot="lead"
        ><Link to="/"
          ><img class="pl-2" src={logoPng} style="width: 8em;" /></Link
        ></svelte:fragment
      >
      <svelte:fragment slot="trail">
        <Link to="/">Home</Link>
        <Link to="/budaya">Budaya</Link>
        <Link to="/rekreasi">Tempat Rekreasi</Link>
        <!-- <Link to="/detailWisata">Detail Tempat Wisata</Link> -->
        <!-- <LightSwitch /> -->
      </svelte:fragment>
    </AppBar>

    <Route path="/detailWisata" component={DetailWisata} />
    <Route path="/rekreasi" component={Rekreasi} />
    <Route path="/budaya" component={Budaya} />
    <Route path="/"><App /></Route>
    <div class="flex justify-center">
      <div class="grid grid-cols-3 gap-3 py-12">
        <span class="text-center">Sistem Branding Kota</span>
        <span class="text-center">SiniLeh! ©️2023</span>
        <span class="text-center">sinileh@mail.com</span>
      </div>
    </div>
  </AppShell>
</Router>
