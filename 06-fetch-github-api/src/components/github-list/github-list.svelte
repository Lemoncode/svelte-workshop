<script lang="ts">
  import { fetchGithubMembers } from "./github.api";
  import type { GithubMember } from "./model";
  import { onMount } from "svelte";
  import { createGithubMembersStore } from "./github-list.store";

  let organizationName = "lemoncode";

  const membersStore = createGithubMembersStore();

  onMount(() => {
    membersStore.loadMembers(organizationName);
  });
</script>

<h3>Member List</h3>

<input bind:value={organizationName} />
<button on:click={() => membersStore.loadMembers(organizationName)}
  >Search</button
>

{#if membersStore.isLoading}
  <p>...loading</p>
{:else}
  <div class="container">
    <span class="header">Avatar</span>
    <span class="header">Id</span>
    <span class="header">Name</span>
    {#each $membersStore as member}
      <img src={member.avatar_url} alt={`${member.login} picture`} />
      <span>{member.id}</span>
      <span>{member.login}</span>
    {/each}
  </div>
{/if}

<style>
  .container {
    display: grid;
    grid-template-columns: 80px 1fr 3fr;
    grid-template-rows: 20px;
    grid-auto-rows: 80px;
    grid-gap: 10px 5px;
  }

  .header {
    background-color: #2f4858;
    color: white;
    font-weight: bold;
  }

  .container > img {
    width: 80px;
  }
</style>
