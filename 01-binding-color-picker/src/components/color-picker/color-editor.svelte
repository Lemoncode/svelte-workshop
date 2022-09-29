<script lang="ts">
  import SingleColorEditor from "./single-color-editor.svelte";
  import type { ValueChangePayload } from "./model";

  export let red = 128;
  export let green = 128;
  export let blue = 128;
</script>

<div class="root">
  <SingleColorEditor name="Red" value={red} on:valuechange />

  <SingleColorEditor name="Green" value={green} on:valuechange />

  <SingleColorEditor name="Blue" value={blue} on:valuechange />
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
