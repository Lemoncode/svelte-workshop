<script lang="ts">
  import type {UserEntity} from './model';
  import type { Writable } from 'svelte/store'; 
  import { getContext, setContext } from "svelte";

  const userInfoStore: any = getContext<Writable<UserEntity>>("userInfoStore");
</script>

<input bind:value={$userInfoStore.username}>
