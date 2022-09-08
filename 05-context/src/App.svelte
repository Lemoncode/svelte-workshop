<script lang="ts">
  import { NameComponent, UserInfoProvider } from "./name-component";
</script>

<main>
  <h1>Context Demo</h1>
  <UserInfoProvider>
    <NameComponent />
  </UserInfoProvider>
  <UserInfoProvider>
    <NameComponent />
  </UserInfoProvider>
</main>
