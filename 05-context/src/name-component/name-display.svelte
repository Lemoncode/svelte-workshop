<script lang="ts">
  import type {UserEntity} from './model';
  import { getContext, setContext } from "svelte";
  import { userInfoStore } from "./user.store";

  const userInfo = getContext<UserEntity>("userInfoStore");
</script>

<h3>Username: {userInfo.username}</h3>