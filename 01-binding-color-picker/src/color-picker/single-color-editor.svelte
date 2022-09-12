<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { ValueChangePayload } from './model';

  export let name = "";
  export let value = 0;

  const dispatch = createEventDispatcher<{valuechange: ValueChangePayload}>();
</script>

<label for="color">{name}</label>
<input
  id="color"
  type="range"
  min="0"
  max="255"
  bind:value
  on:input={(e) => dispatch('valuechange', {name: name, value: +e.currentTarget.value})}
/>
