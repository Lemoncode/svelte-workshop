<script lang="ts">
  export let red = 128;
  export let green = 128;
  export let blue = 128;
</script>

<div
  class="color-display"
  style="background-color: rgb({red}, {green}, {blue})"
/>

<style>
  .color-display {
    width: 200px;
    height: 200px;
  }
</style>
