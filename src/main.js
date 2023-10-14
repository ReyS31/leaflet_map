import "./app.postcss";
// import App from "./App.svelte";
import NewRoute from "./NewRoute.svelte";

const app = new NewRoute({
  target: document.getElementById("app"),
});

export default app;
