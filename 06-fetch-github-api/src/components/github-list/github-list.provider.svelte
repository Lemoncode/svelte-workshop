<script lang="ts">
  import { setContext } from "svelte";
  import {
    createGithubMembersStore,
    setMembersContext,
  } from "./github-list.store";

  const membersStore = createGithubMembersStore();
  setMembersContext(membersStore);
</script>

<slot />
