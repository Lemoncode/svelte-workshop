<script lang="ts">
  import type { Writable } from 'svelte/store'; 
  import { setContext } from "svelte";
  import type { UserEntity } from "./model";
  import { createUserInfoStore } from "./user.store";

  const userInfoStore = createUserInfoStore();

  setContext<Writable<UserEntity>>("userInfoStore", userInfoStore);
</script>

<slot />