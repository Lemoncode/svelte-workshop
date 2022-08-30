<script lang="ts">
  import { fetchGithubMembers } from "./github.api";
  import type { GithubMember } from "./model";
  import { onMount } from "svelte";

  let organizationName = "lemoncode";
  let members: GithubMember[] = [];
  let membersPromise: Promise<GithubMember[]> = new Promise<GithubMember[]>(
    (resolve) => resolve([])
  );

  const loadMembers = (organizationName) => {
    membersPromise = fetchGithubMembers(organizationName).then((result) => {
      members = result;
      return result;
    });
  };

  onMount(() => {
    loadMembers(organizationName);
  });
</script>

<h3>Member List</h3>

<input bind:value={organizationName} />
<button on:click={() => loadMembers(organizationName)}>Search</button>

{#await membersPromise}
  <p>...loading</p>
{:then members}
  <div class="container">
    <span class="header">Avatar</span>
    <span class="header">Id</span>
    <span class="header">Name</span>
    {#each members as member}
      <img src={member.avatar_url} alt={`${member.login} picture`} />
      <span>{member.id}</span>
      <span>{member.login}</span>
    {/each}
  </div>
{:catch error}
  <p>An error occurred!</p>
{/await}

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
