<script lang="ts">
  import type {UserEntity} from './model';
  import type { Writable } from 'svelte/store';
  import { getContext, setContext } from "svelte";

  const userInfoStore = getContext<Writable<UserEntity>>("userInfoStore");
</script>

<h3>Username: {$userInfoStore.username}</h3>