# Summary

In this example we are going to query a rest api.

We will use three approaches:

- In a simple scenario just mix the `fetch` function with the markup.

- In a more complex scenario use the Svelte component lifecycle

- And last but not least we will give it a twist using a provider.

# Step By Step Guide

- This example will take a starting point _00-scratch-typescript_

- Let's install the packages.

```bash
npm install
```

- Let's create a _github-list_ folder.

- We will query the github api to retrieve the members of a given organization, in order to do that we will create a model and a separate api file:

_./src/components/github-list/model.ts_

```ts
export interface GithubMember {
  id: string;
  login: string;
  avatar_url: string;
}
```

_./src/components/github-list/github.api.ts_

```ts
import type { GithubMember } from "./model";

export const fetchGithubMembers = async (
  organization: string
): Promise<GithubMember[]> => {
  const response = await fetch(
    `https://api.github.com/orgs/${organization}/members`
  );
  return response.json();
};
```

- Let's create a _github-list_ component, first let's add some styling (we will use css grid)

_./src/components/github-list/github-list.svelte_

```svelte
<script lang="ts">
</script>

<h3>Member List</h3>

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
```

- Let's import the api module that we have created:

_./src/components/github-list/github-list.svelte_

```diff
<script lang="ts">
+  import {fetchGithubMembers} from './github.api';
</script>
```

- And now let's use some Svelte template syntax to call the member list
  and wait for the results:

_./src/components/github-list/github-list.svelte_

```diff
<h3>Member List</h3>

+ {#await fetchGithubMembers("lemoncode")}
+  <p>...loading</p>
+ {:then members}
+  <div class="container">
+    <span class="header">Avatar</span>
+    <span class="header">Id</span>
+    <span class="header">Name</span>
+    {#each members as member}
+      <img src={member.avatar_url} alt={`${member.login} picture`} />
+      <span>{member.id}</span>
+      <span>{member.login}</span>
+    {/each}
+  </div>
+ {:catch error}
+  <p>An error occurred!</p>
+ {/await}
```

- Let's create a barrel

_./src/components/github-list/index.ts_

```diff
export { default as GithubMemberList } from "./github-list.svelte";
```

- Let's import this component in the main app and instantiate it:

_./src/App.svelte_

```svelte
<script lang="ts">
  import { GithubMemberList } from "./components/github-list";
</script>

<GithubMemberList />
```

- Let's check the result:

```bash
npm run dev
```

- So far so good, but this approach does not cover more complex scenarios, for instance what if we just add an input to change the organization name and a button to trigger the search? In this case we can make use of the builtin Svelte lifecycle for components.

- Let's add the input and the button:

_./src/components/github-list/github-list.svelte_

```diff
<h3>Member List</h3>

+ <input />
+ <button>Search</button>

{#await fetchGithubMembers("lemoncode")}
```

- Let's create two variables to hold the current filter and members list,
  then create a method to fetch the data based on the current organization filter:

_./src/components/github-list/github-list.svelte_

```diff
<script lang="ts">
  import { fetchGithubMembers } from "./github.api";
+  import type { GithubMember } from "./model";

+  let organizationName = "lemoncode";
+  let members: GithubMember[] = [];
+  let membersPromise: Promise<GithubMember[]> = new Promise<GithubMember[]>(
+    (resolve) => resolve([])
+  );
+
+  const loadMembers = (organizationName) => {
+    membersPromise = fetchGithubMembers(organizationName).then((result) => {
+      members = result;
+      return result;
+    });
+  };
</script>
```

- Let's hook to the _onMount_ method and execute the first call
  once the component has been mounted:

```diff
+ import { onMount } from "svelte";
// ...

  const loadMembers = (organizationName) => {
    fetchGithubMembers(organizationName).then((result) => {
      members = result;
    });
  };

+  onMount(() => {
+    loadMembers(organizationName);
+  });
</script>
```

- Now let's update our markup, let's remove the _#await_ template syntax
  and just read from the member variable:

_./src/components/github-list/github-list.svelte_

```diff
+ <input bind:value={organizationName} />
<button>Search</button>

- {#await fetchGithubMembers("lemoncode")}
+ {#await membersPromise}
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
```

- Let's implement now the search button click handler:

```diff
<input bind:value={organizationName} />
- <button>Search</button>
+ <button on:click={() => loadMembers(organizationName)}>Search</button>
```

- Now you can just try entering in the input organization names like
  _microsoft_ or _facebook_ and you will get the right results:

```bash
npm run dev
```

- [Refactor] [Time Permitting] Right now we had implemented this in a very traditional way, if we were working with React we could think about extracting some of this functionality into a custom hook, let's see how to do this in Svelte using stores and context.

- First of all we can try to isolate the members handling into a
  store:
  - We will create a factory function that will return:
    - A writable store that will hold a writable store including
      the list of github members.
    - A method load the member list onto the store (passing as param
      the organization name).
    - Then we will return the store subscribe method and the loadMembers.
    - The loading promise (just to comply with the component await, later
      on we could refactor this)

_./src/components/github-list/github-list.store.ts_

```ts
import { writable } from "svelte/store";
import { fetchGithubMembers } from "./github.api";
import type { GithubMember } from "./model";

export const createGithubMembersStore = () => {
  const { set, subscribe, update } = writable<GithubMember[]>([]);
  let isLoading = false;

  const loadMembers = (organizationName) => {
    isLoading = true;
    fetchGithubMembers(organizationName)
      .then((result) => {
        isLoading = false;
        set(result);
      })
      .catch((error) => {
        isLoading = false;
        set([]);
      });
  };

  return { subscribe, loadMembers, isLoading };
};

export type MembersStore = ReturnType<typeof createGithubMembersStore>;
```

- Now that we have this entry we can directly use it in our component:

_./src/components/github-list.svelte_

```diff
<script lang="ts">
  import { fetchGithubMembers } from "./github.api";
  import type { GithubMember } from "./model";
  import { onMount } from "svelte";
+ import { createGithubMembersStore } from "./github-list.store";

  let organizationName = "lemoncode";
-  let members: GithubMember[] = [];
-  let membersPromise: Promise<GithubMember[]> = new Promise<GithubMember[]>(
-    (resolve) => resolve([])
-  );

-  const loadMembers = (organizationName) => {
-    membersPromise = fetchGithubMembers(organizationName).then((result) => {
-      members = result;
-      return result;
-    });
-  };

+   const membersStore =  createGithubMembersStore();


  onMount(() => {
-    loadMembers(organizationName);
+      membersStore.loadMembers(organizationName);
  });
</script>

<h3>Member List</h3>

<input bind:value={organizationName} />
-<button on:click={() => loadMembers(organizationName)}>Search</button>
+<button on:click={() => membersStore.loadMembers(organizationName)}>Search</button>


-{#await membersPromise}
+{#if membersStore.isLoading}
  <p>...loading</p>
-{:then members}
+ {:else}
  <div class="container">
    <span class="header">Avatar</span>
    <span class="header">Id</span>
    <span class="header">Name</span>
-    {#each members as member}
+    {#each $membersStore as member}

      <img src={member.avatar_url} alt={`${member.login} picture`} />
      <span>{member.id}</span>
      <span>{member.login}</span>
    {/each}
  </div>
+ {/if}
- {:catch error}
-  <p>An error occurred!</p>
- {/await}
```

> Note: Catch left of as a lab

- That's great, but in some case we may need this data available in other
  pages, we don't need to decide right now that this data will just live
  inside the github-list svelte component, why not create a context and
  expose it via a provider?

- This time we are going to setup a unique identifier for the context.

```bash
npm install uuid -P
```

_./src/components/github-list/github-list.store.ts_

```diff
import { writable } from "svelte/store";
+ import { setContext, getContext } from "svelte";
+ import {v4 as uuidv4} from 'uuid';
// (...)

- export type MembersStore = ReturnType<typeof createGithubMembersStore>;

+ const membersContextUID = uuidv4();
+
+ export const setMembersContext = (membersStore: MembersStore) =>
+  setContext(membersContextUID, membersStore);

+ export const getMembersContext = () => getContext<MembersStore> (membersContextUID);
```

- Ok, now that we have this define we can setup the context in a
  provider:

_./src/components/github-list/github-list.provider.svelte_

```svelte
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
```

- Add it to our barrel:

_./src/components/github-list/index.ts_

```diff
export { default as GithubMemberList } from "./github-list.svelte";
+ export { default as GithubMemberListProvider } from "./github-list.provider.svelte";
```

- Wrap the components (or components in the context):

_./src/App.svelte_

```diff
<script lang="ts">
-  import { GithubMemberList } from "./components/github-list";
+  import { GithubMemberList, GithubMemberListProvider } from "./components/github-list";
</script>

+ <GithubMemberListProvider>
    <GithubMemberList />
+ </GithubMemberListProvider>
```

- And let's use this context in our component:

_./src/components/github-list/github-list.svelte_

```diff
<script lang="ts">
  import { fetchGithubMembers } from "./github.api";
  import type { GithubMember } from "./model";
  import { onMount } from "svelte";
-  import { createGithubMembersStore } from "./github-list.store";
+  import { getMembersContext } from './github-list.store';

  let organizationName = "lemoncode";

-  const membersStore = createGithubMembersStore();
+  const membersStore = getMembersContext();
```

Some Labs:

- Catch hasn't been implemented, try to implement it.

- Let's try to simplify the _github-list.svelte_ and move
  the _onMount_ implementation to the _provider_

- What if you enter an organization name that does not exist? How could
  you handle this scenario? Just take a look at what the api returns and
  handle this error, do you want to vie a try by yourself?
