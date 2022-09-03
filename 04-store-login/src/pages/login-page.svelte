<script lang="ts">
  import { useNavigate } from "svelte-navigator";
  import { userInfoStore } from "../stores";
  const navigate = useNavigate();
  let username = "Mr. Nobody";

  const handleLogin = (e) => {
    userInfoStore.update((previous) => ({ ...previous, username }));
    navigate("/home");
  };
</script>

<div class="root">
  <h1>Login Page</h1>
  <input bind:value={username} />
  <button on:click={handleLogin}>Login</button>
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
