<script lang="ts">
  import { userInfoStore } from "../stores";

  let showLoggedInUser = false;
</script>

<div class="root">
  <h1>Home page</h1>
  <button
    on:click={() => {
      showLoggedInUser = !showLoggedInUser;
    }}>Show Logged in User</button
  >
  {#if showLoggedInUser}
    <h2>logged in user: {$userInfoStore.username}</h2>
    <input bind:value={$userInfoStore.username} />
  {/if}
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
  }
  input {
    width: 270px;
    padding: 10px;
  }
  button {
    width: 300px;
  }
</style>
