<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import { NavBar } from "./common";
  import { HomePage, LoginPage } from "./pages";
</script>

<main>
  <Router>
    <NavBar />
    <Route path="/">
      <LoginPage />
    </Route>
    <Route path="home">
      <HomePage />
    </Route>
  </Router>
</main>

<style>
  main {
    display: grid;
    grid-template-rows: auto 1fr;
    flex-grow: 1;
  }
</style>
