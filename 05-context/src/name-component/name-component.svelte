<script lang="ts">
  import type {UserEntity} from './model';
  import { setContext } from "svelte";
  import NameDisplay from "./name-display.svelte";
  import NameEdit from "./name-edit.svelte";

  setContext<UserEntity>("userInfoStore", {
    username: `Seed name: ${Math.random()}`,
  });  
</script>

<NameDisplay />
<NameEdit />