<script lang="ts">
  import type { Writable } from 'svelte/store'; 
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import type { UserEntity } from "./model";

  const userInfoStore = writable<UserEntity>({
    username: "Seed name " + Math.random(),
  });

  setContext<Writable<UserEntity>>("userInfoStore", userInfoStore);
</script>

<slot />