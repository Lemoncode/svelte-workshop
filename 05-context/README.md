# Summary

- We will create two components: one to display a name, other to edit a name. We will wrap them in a _Name_ component.

- We won't use props (yes, this is an overkill it's just for the
  sake of the example).

- We will first solve the problem using stores.

- Then we will create two instances of the _Name_ component, and
  we will check that both components will share the same info :(.

- Time to start using context, let's use it just to store a given string,
  what's going on? No reactivity !!!

- Solution combine context with stores.

- Just to wrap up, we can create a provider to wrap all this context
  definition.

# Step By Step Guide

- This example will take a starting point _00-boiler-typescript_

- Let's install the packages.

```bash
npm install
```

- Let's create a model that will hold user information:

_./src/name-component/model.ts_

```ts
export interface UserEntity {
  username: string;
}
```

- We will create a component that will let us display and edit a name and
  we won't use props to pass data around (it's an overkill, but just to get
  a simplified scenario).

- To hold the data we will first use a store, and later on we will check
  which limitations we have.

_./src/name-component/user.store.ts_

```ts
import type { UserEntity } from "./model";
import { writable } from "svelte/store";

export const userInfoStore = writable<UserEntity>({
  username: "default user",
});
```

- Now let's create a component to display that info:

_./src/name-component/name-display.svelte_

```svelte
<script lang="ts">
  import { userInfoStore } from "./user.store";
</script>

<h3>Username: {$userInfoStore.username}</h3>
```

- And a component to edit the name:

_./src/name-component/name-edit.svelte_

```svelte
<script lang="ts">
  import { userInfoStore } from "./user.store";
</script>

<input bind:value={$userInfoStore.username} />
```

- Let's put it all together in a _name-component_:

_./src/name-component/name-component.svelte_

```svelte
<script lang="ts">
  import NameDisplay from "./name-display.svelte";
  import NameEdit from "./name-edit.svelte";
</script>

<NameDisplay />
<NameEdit />
```

- And expose it via barrel:

_./src/name-component/index.ts_

```ts
export { default as NameComponent } from "./name-component.svelte";
```

- If we instantiate the component in our main app

_./src/App.svelte_

```svelte
<script lang="ts">
  import { NameComponent } from "./name-component";
</script>

<main>
  <h1>Context Demo</h1>
  <NameComponent />
</main>
```

And run the example, so far so good everything seems to work fine.

Buuut... let's try to instantiate two instances of the component:

_./src/App.svelte_

```diff
  <script lang="ts">
    import { NameComponent } from "./name-component";
  </script>

  <main>
    <h1>Context Demo</h1>
    <NameComponent />
+   <NameComponent />
  </main>
```

What's going on? Since we are using an store both components are sharing
the same data, this doesn't look like a good idea.

What else can we do?

Let' play with Svelte Context.

Let's get rid of the store solution (temporarily :)) and let's start
using a new _context_ api. We got _setContext_ and _getContext_ that we'll use to
pass a key and get a value...

This seems to be ok, but we will need to add an extra step to make it
work, why? Because context in svelte:

- Allows you to call get and set context just when a component is initialized
  (so no update in _onChange_ handlers like...).

- Context is not reactive.

So let's try first to add a "react" like approach:

Let's initialize the value (in this case we will add some random number
to check that bot name edit instances are initialized with different data)

_./src/name-component/name-component.svelte_

```diff
  <script lang="ts">
+   import { setContext } from "svelte";
+   import type { UserEntity } from "./model";
    import NameDisplay from "./name-display.svelte";
    import NameEdit from "./name-edit.svelte";

+   setContext<UserEntity>("userInfoStore", {
+     username: `Seed name: ${Math.random()}`,
+   });
  </script>

  <NameDisplay />
  <NameEdit />
```

Then in the display and edit components:

_./src/name-component/name-display.svelte_

```diff
  <script lang="ts">
-   import { userInfoStore } from "./user.store";
+   import type { UserEntity } from "./model";
+   import { getContext } from "svelte";
+
+   const userInfo = getContext<UserEntity>("userInfoStore");
  </script>

- <h3>Username: {$userInfoStore.username}</h3>
+ <h3>Username: {userInfo.username}</h3>
```

_./src/name-component/name-edit.svelte_

```diff
  <script lang="ts">
-   import { userInfoStore } from "./user.store";
+   import { getContext, setContext } from "svelte";
+   import type { UserEntity } from "./model";
+
+   let userInfo = getContext<UserEntity>("userInfoStore");
  </script>

- <input bind:value={$userInfoStore.username} />

+ <input
+   bind:value={userInfo.username}
+   on:input={(e) =>
+     setContext<UserEntity>("userInfoStore", {
+       ...userInfo,
+       username: e.currentTarget.value,
+   })}
+ />
```

Well if we run this, a good thing is that we got two different values
on each component, that's nice...

BUT we will get no reactivity !! :-@, what's going on here? If we want
to get reactivity with a context we have to combine it with stores,
but in this case we will keep the store as private and just keep
it for the context it self.

Let's update our code:

On the root name edit component we will set a context but this time
we will assign an store to it:

_./src/name-component/name-component.svelte_

```diff
  <script lang="ts">
+   import type { Writable } from "svelte/store";
+   import { writable } from "svelte/store";
    import { setContext } from "svelte";
    import type { UserEntity } from "./model";
    import NameDisplay from "./name-display.svelte";
    import NameEdit from "./name-edit.svelte";

+   const userInfoStore = writable<UserEntity>({
+     username: `Seed name: ${Math.random()}`,
+   });
-   setContext("userInfoStore", {
-     username: `Seed name: ${Math.random()}`,
-   });
+   setContext<Writable<UserEntity>>("userInfoStore", userInfoStore);
  </script>
```

- Now let's go for the display name component, since we are using an
  store things get easier.

_./src/name-component/name-display.svelte_

```diff
  <script lang="ts">
    import type { UserEntity } from "./model";
+   import type { Writable } from 'svelte/store';
    import { getContext } from "svelte";

-   const userInfo = getContext<UserEntity>("userInfoStore");
+   const userInfoStore = getContext<Writable<UserEntity>>("userInfoStore");
  </script>

- <h3>Username: {userInfo.username}</h3>
+ <h3>Username: {$userInfoStore.username}</h3>
```

- It's time to update the edit name component, this time we will
  just get access to the context in the component initialization and
  we will use the store.

_./src/name-component/name-edit.svelte_

```diff
  <script lang="ts">
+   import type { Writable } from "svelte/store";
-   import { getContext, setContext } from "svelte";
+   import { getContext } from "svelte";
    import type { UserEntity } from "./model";

-   const userInfo = getContext<UserEntity>("userInfoStore");
+   const userInfoStore = getContext<Writable<UserEntity>>("userInfoStore");

+ <input bind:value={$userInfoStore.username}>

- <input
-   bind:value={userInfo.username}
-   on:input={(e) =>
-     setContext("userInfoStore", {
-       ...userInfo,
-       username: e.currentTarget.value,
-   })}
- />
```

- Let's give a try

```bash
npm run dev
```

- Now have coupled our root component _name_ component with the context
  definition, but this not may be the case, maybe we just want to define our
  context at a different level, in order to use this we can define our own provider,
  let's refactor this:

_./src/name-component/user-info.provider.svelte_

```svelte
<script lang="ts">
  import type { Writable } from "svelte/store";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import type { UserEntity } from "./model";

  const userInfoStore = writable<UserEntity>({
    username: `Seed name: ${Math.random()}`,
  });

  setContext<Writable<UserEntity>>("userInfoStore", userInfoStore);
</script>

<slot />
```

- Let's remove the context definition on the root component:

_./src/name-component/name-component.svelte_

```diff
  <script lang="ts">
-   import type { Writable } from "svelte/store";
-   import { writable } from "svelte/store";
-   import { setContext } from "svelte";
-   import type  {UserEntity } from "./model";
    import NameDisplay from "./name-display.svelte";
    import NameEdit from "./name-edit.svelte";
-
-   const userInfoStore = writable<UserInfo>({
-     username: `Seed name: ${Math.random()}`,
-   });
-
-   setContext("userInfoStore", userInfoStore);
  </script>

  <NameDisplay />
  <NameEdit />
```

- Let's update our index barrel

_./src/name-component/index.ts_

```diff
export { default as NameComponent } from "./name-component.svelte";
+ export { default as UserInfoProvider } from "./user-info.provider.svelte";
```

- And we can use it on our app component:

_./src/App.svelte_

```diff
  <script lang="ts">
-   import { NameComponent } from "./name-component";
+   import { NameComponent, UserInfoProvider } from "./name-component";
  </script>

  <main>
    <h1>Context Demo</h1>
+   <UserInfoProvider>
      <NameComponent />
+   </UserInfoProvider>
+   <UserInfoProvider>
      <NameComponent />
+   </UserInfoProvider>
  </main>
```

Now you can give a try and enclose the second _NameComponent_ inside the
first _UserInfoProvider_

- Let's do a final refactor, we have enclosed the instantiation of the
  _userInfoStore_ inside of the provider, we could just enclose it in the
  _user.store_ but if we want to avoid any other part of the app to access
  the same instantiated store we could just move to our _user.store.ts_
  but use a factory function instead:

_./src/name-component/user.store.ts_

```diff
  import type { UserEntity } from "./model";
  import { writable } from "svelte/store";

- export const userInfoStore = writable<UserEntity>({
-   username: "default user",
- });
+ export const createUserInfoStore = () =>
+   writable<UserEntity>({
+     username: `Seed name: ${Math.random()}`,
+   });
```

_./src/name-component/user-info.provider.svelte_

```diff
  <script lang="ts">
    import type { Writable } from "svelte/store";
    import { setContext } from "svelte";
-   import { writable } from "svelte/store";
    import type { UserEntity } from "./model";
+   import { createUserInfoStore } from "./user.store";

-   const userInfoStore = writable<UserEntity>({
-     username: `Seed name: ${Math.random()}`,
-   });
-
+   const userInfoStore = createUserInfoStore();
    setContext<Writable<UserEntity>>("userInfoStore", userInfoStore);
  </script>

  <slot />
```

Not so bad, but the getContext and setContest are a bit clunky:

- You need to setup the right typing.
- You need to remember the magic string.

Let's enclose a helper in the user.store:

_./src/name-component/user.store.ts_

```diff
+ import { getContext, setContext } from "svelte";
+ import type { Writable } from "svelte/store";
  import type { UserEntity } from "./model";
  import { writable } from "svelte/store";

  export const createUserInfoStore = () =>
    writable<UserEntity>({
      username: `Seed name ${Math.random()}`,
    });

+ export const getUserInfoContext = () =>
+   getContext<Writable<UserEntity>>("userInfoStore");
+ export const setUserInfoContext = (userInfoStore: Writable<UserEntity>) =>
+   setContext("userInfoStore", userInfoStore);
```

Let's use this new helper in nameDisplay and nameEdit

_./src/name-component/name-display.svelte_

```diff
  <script lang="ts">
-   import type {UserEntity} from "./model";
-   import type { Writable } from "svelte/store";
-   import { getContext } from "svelte";
+   import { getUserInfoContext } from "./user.store";

-    const userInfoStore = getContext<Writable<UserEntity>>("userInfoStore");
+    const userInfoStore = getUserInfoContext();
  </script>

  <h3>Username: {$userInfoStore.username}</h3>
```

_./src/name-component/name-edit.svelte_

```diff
  <script lang="ts">
-   import type { Writable } from "svelte/store";
-   import { getContext } from "svelte";
-   import type { UserEntity } from "./model";
+   import { getUserInfoContext } from "./user.store";

-   const userInfoStore = getContext<Writable<UserEntity>>("userInfoStore");
+   const userInfoStore = getUserInfoContext();
  </script>

  <input bind:value={$userInfoStore.username}>
```

And in the provider:

_./src/name-component/user-info.provider.svelte_

```diff
  <script lang="ts">
-   import type { Writable } from "svelte/store";
-   import { setContext } from "svelte";
-   import type { UserEntity } from "./model";
-   import { createUserInfoStore } from "./user.store";
+   import { createUserInfoStore, setUserInfoContext } from "./user.store";

    const userInfoStore = createUserInfoStore();

-   setContext<Writable<UserEntity>>("userInfoStore", userInfoStore);
+   setUserInfoContext(userInfoStore);
```

We can check that things are working as expected.

And one last thing let's get rid of the context magic string and use
a unique symbol:

```bash
npm install uuid -P
```

And in the store:

_./src/name-component/user.store.ts_

```diff
  import { getContext, setContext } from "svelte";
+ import {v4 as uuidv4} from "uuid";
  import type { Writable } from "svelte/store";
  import type { UserEntity } from "./model";
  import { writable } from "svelte/store";

  export const createUserInfoStore = () =>
    writable<UserEntity>({
      username: `Seed name ${Math.random()}`,
    });
+
+ const membersContextUID = uuidv4();

  export const getUserInfoContext = () =>
-   getContext<Writable<UserEntity>>("userInfoStore");
+   getContext<Writable<UserEntity>>(membersContextUID);
  export const setUserInfoContext = (userInfoStore: Writable<UserEntity>) =>
-   setContext("userInfoStore", userInfoStore);
+   setContext(membersContextUID, userInfoStore);
```
