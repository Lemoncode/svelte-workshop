<script lang="ts">
  import type {UserEntity} from './model';
  import { setContext } from "svelte";
  import type { Writable } from 'svelte/store';
  import {writable } from 'svelte/store';
  import NameDisplay from "./name-display.svelte";
  import NameEdit from "./name-edit.svelte";

  const userInfoStore = writable<UserEntity>({
   username: `Seed name:  ${Math.random()}`,
  });

  setContext<Writable<UserEntity>>("userInfoStore", userInfoStore);
</script>

<NameDisplay />
<NameEdit />