<script lang="ts">
  import type {UserEntity} from './model';
  import { getContext, setContext } from "svelte";

  let userInfo = getContext<UserEntity>("userInfoStore");
</script>

 <input
  bind:value={userInfo.username}
  on:input={(e) =>
    setContext("userInfoStore", {
      ...userInfo,
      username: e.currentTarget.value,
    })}
 />
