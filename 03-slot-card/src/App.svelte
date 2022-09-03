<script lang="ts">
  import { CardComponent } from "./common";
</script>

<main>
  <CardComponent>
    <h2 slot="header">Header Card A</h2>
    <h3 slot="body">Body Card A</h3>
  </CardComponent>
  <CardComponent>
    <h2 slot="header">Header Card B</h2>
    <h3 slot="body">Body Card B</h3>
  </CardComponent>
</main>

<style>
  main {
    display: flex;
    gap: 50px;
  }
</style>
