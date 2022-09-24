# Summary

When we work with React we are quite used to create a Context when we need
to share data between components, without having to pass it around using props.

The guys at Svelte have broken down the concept into two pieces:

- Context: they let us share data between components at certain level of the
  hierarchy.
- Stores: the allow us to share data and be reactive to changes in the data.

If we want to fullfil the same goal as with React.Context we will have to make
use of both.

Let's start by learning how _stores_ work: in this example we will learn how to share global data in a reactive way using writable stores.

# Step By Step Guide

- This example will take a starting point _00-boiler-typescript_

- Let's install the packages.

```bash
npm install
```

- Now we are going to create a classical scenario:

  - A login page.
  - A Navbar layout showing the name of the user logged in.
  - A second page that will display the user name and will let the user
    update it (and this change will get reflected throughout the application).

- We are going to create a folder called _pages_ under _src_ path and create inside a login page,
  a main page and a barrel:

_./src/pages/login-page.svelte_

```svelte
<script lang="ts">
  let username = "Mr. Nobody";
</script>

<div class="root">
  <h1>Login Page</h1>
  <input bind:value={username} />
  <button on:click={() => console.log("It should navigate to home page")}>Login</button>
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
```

_./src/pages/home-page.svelte_

```svelte
<script lang="ts">
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
    <h2>Here we should show the logged in user</h2>
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
```

_./src/pages/index.ts_

```ts
export { default as LoginPage } from "./login-page.svelte";
export { default as HomePage } from "./home-page.svelte";
```

- Let's create a navbar layout plus a barrel:

_./src/common/navbar.svelte_

```svelte
<h2>User Logged in:</h2>

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
```

_./src/common/index.ts_

```ts
export { default as NavBar } from "./navbar.svelte";
```

Now we need a SPA router (like react-router), let's install _svelte-navigator_:

```bash
npm install svelte-navigator --save
```

Let's define the routes and the layout usage in our _App.svelte_

_./src/App.svelte_

```svelte
<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import { NavBar } from "./common";
  import { HomePage, LoginPage } from "./pages";
</script>

<main>
  <Router>
    <NavBar />
    <Route path="/">
      <LoginPage />
    </Route>
    <Route path="home">
      <HomePage />
    </Route>
  </Router>
</main>

<style>
  main {
    display: grid;
    grid-template-rows: auto 1fr;
    flex-grow: 1;
  }
</style>
```

- And let's define the navigation behavior in our _login-page_

_./src/pages/login-page.svelte_

```diff
  <script lang="ts">
+   import { useNavigate } from "svelte-navigator";
+   const navigate = useNavigate();
    let username = "Mr. Nobody";
  </script>

  <div class="root">
    <h1>Login Page</h1>
    <input bind:value={username} />
-   <button on:click={() => console.log("It should navigate to home page")}>Login</button>
+   <button on:click={() => navigate("/home")}>Login</button>
  </div>
```

- Let's give a try to what we have created:

```bash
npm run dev
```

- Let's recap, we can see two pages:

  - Login page.
  - Home page.

- And there's a common component called _NavBar_ that will be displayed on top of the app.

The behavior that we want to achieve:

- When the user logs in:
  - The navBar should change to display the user's name.
  - The home page should change to display the user's name.

Once that we are on the home page we want to be able to update the login name and this change should be reflected on the nav bar and on the home page.

The user information should be globally accessible, so we don't need to pass it around using props.

It seems like a good idea to use a _writable store_ to share the data.

Let's go for it:

- First we will create the store, we could just store a simple string, but in this
  case we will store an object, so we can check the difference between replacing
  the value and updating it.

In order to create a store:

- We will import _writable_ store from _svelte-store_. This will allow
  us to hold a global data and be able to update it.

- Then we will initialize the store with the initial value, it could be a simple string,
  but for this example we will use an object just to allow us to check the difference between replacing the value and updating it.

_./src/stores/user.store.ts_

```ts
import { writable } from "svelte/store";

export const userInfoStore = writable({
  username: "no user logged in",
});
```

- Let's create a barrel for the store folder:

_./src/stores/index.ts_

```ts
export * from "./user.store";
```

- Now in the login page let's make use of the store, when the user clicks on the login button we will update the store with the user's name.

_./src/pages/login-page.svelte_

```diff
  <script lang="ts">
    import { useNavigate } from "svelte-navigator";
+   import { userInfoStore } from "../stores";
    const navigate = useNavigate();
    let username = "Mr. Nobody";

+   const handleLogin = (e) => {
+     userInfoStore.set({ username });
+     navigate("/home");
+   };
  </script>

  <div class="root">
    <h1>Login Page</h1>
    <input bind:value={username}/>
-   <button on:click={() => navigate('home')}>Login</button>
+   <button on:click={handleLogin}>Login</button>
  </div>
```

- If we use _set_ we are replacing the whole object without taking into consideration the previous value, we may want to keep a reference to the old object and use the spread operator to keep the previous values and just replace only the one affected by the change, we can do this by using the store _update_ method, it could be something like:

_./src/pages/login-page.svelte_

```diff
  const handleLogin = (e) => {
-   userInfoStore.set({ username });
+   userInfoStore.update(previous => ({ ...previous, username }));
    navigate("/home");
  };
```

- Cool! Now let's hop onto the _NavBar_ component and display the user's name:
  - We will import the _userInfoStore_ that we have created.
  - We will start by subscribing to store changes, and then update user Info.

_./src/common/navbar.svelte_

```diff
+ <script lang="ts">
+   import { userInfoStore } from "../stores";
+
+   let userInfo = null;
+
+   userInfoStore.subscribe(newUserInfo => {
+    userInfo = newUserInfo;
+   });
+ </script>
+
- <h2>User Logged in:</h2>
+ <h2>User Logged in: {userInfo.username}</h2>
```

This approach is ok-ish but we would have to take care of doing even some cleanup in the component (unsubscribe), Svelte offers us a short cut (just a reactive assignment):

- To access the value of the _userInfoStore_ we have to prefix the store with the
  _$_ sign,
- We will ask to listen the userInfoStore for changes, in order to use this value we have to use the _$_ sign again (in this case to make reactive this piece of code, this would be similar
  in React to adding _userInfoStore_ to the dependencies of _useEffect_).

_./src/common/navbar.svelte_

```diff
  <script lang="ts">
    import { userInfoStore } from "./stores";
-   let userInfo = null;
-
-   userInfoStore.subscribe(newUserInfo => {
-     userInfo = newUserInfo;
-   });
+   $: userInfo = $userInfoStore;
  </script>

  <h2>User Logged in: {userInfo.name}</h2>
```

> Note we don't need to declare _userInfoStore_ using _let_, _Svelte_ will detect this and
> initialize it for us.

This is not bad, buuuuuut.... we can give it one more turn :), since we are using _$userInfoStore_
this is reactive a statement (tip $ prefix :)), why not just use it directly in our _html_:

```diff
  <script lang="ts">
    import { userInfoStore } from "./stores";
-   $: userInfo = $userInfoStore;
  </script>

- <h2>User Logged in: {userInfo.name}</h2>
+ <h2>User Logged in: {$userInfoStore.username}</h2>
```

- Let's jump into the home page, in this page we got a button that toggles the user's name
  visibility, showing the user name in this case is a piece of cake...

> Exercise: try to do it by our own, before just copying the solution.

How this could work:

_./src/pages/home-page.svelte_

```diff
  <script lang="ts">
+   import { userInfoStore } from "../stores";
+
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
-     <h2>Here we should show the logged in user</h2>
+     <h2>logged in user: {$userInfoStore.username}</h2>
    {/if}
  </div>
```

- So far so good, but now let's go for a twist, we want to be able to update the user's name, from the home page, we can just bind
  to _userInfo.username_

```diff
  {#if showLoggedInUser}
    <h2>logged in user: {$userInfoStore.username}</h2>
+   <input
+     bind:value={$userInfoStore.username}
+   />
  {/if}
```

Let's give a try and YEEES... stores and reactive _$_ are our friends :).
