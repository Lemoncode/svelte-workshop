<script lang="ts">
  import { userInfoStore } from "../stores";
</script>

<h2>User Logged in: {$userInfoStore.username}</h2>

<style>
  h2 {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 20px 40px;
    margin: 0;
    box-sizing: border-box;
    background-color: #ff5722;
    color: white;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }
</style>
