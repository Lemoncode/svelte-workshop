# Summary

In React we are used to the _children_ property of a component, when we work
with Svelte we get _Slots_ and this includes some extra goodies:

- We can have a single slot or multiple named slots.
- We can just add a default markup in case a given slot is not provided.
- We can pass props between the slot and the parent component.

# Step By Step Guide

- This example will take a starting point _00-boiler-typescript_

- Let's install the packages.

```bash
npm install
```

- In this example we will create a card component, let's start by defining the component

_./src/common/card.svelte_

```svelte
<div class="root">
  <!-- header -->
  <div class="card-header">
    <h2>Default header</h2>
  </div>
  <!-- body -->
  <div class="card-body">
    <h3>Default body</h3>
  </div>
</div>

<style>
  .root {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 400px;
    width: 300px;
    padding: 5px;
    background-color: white;
    color: black;
    border-radius: 8px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
  }
  .card-body {
    border-radius: 8px;
    background-color: whitesmoke;
  }
</style>
```

Let's create a barrel for _common_ folder:

_./src/common/index.ts_

```ts
export { default as CardComponent } from "./card.svelte";
```

Let's add two instances of the component in our main _App_:

_./src/App.svelte_

```sv
<script lang="ts">
  import { CardComponent } from "./common";
</script>

<main>
  <CardComponent/>
  <CardComponent/>
</main>

<style>
  main {
    display: flex;
    gap: 50px;
  }
</style>
```

- Cool, time to play with slots, we want to display in each card a different body.

- Let's create in our card component a slot for the body.

_./src/common/card.svelte_

```diff
  <div class="root">
    <!-- header -->
    <div class="card-header">
      <h2>Default header</h2>
    </div>
    <!-- body -->
    <div class="card-body">
+     <slot>
        <h3>Default body</h3>
+     </slot>
    </div>
  </div>
```

- Now let's define the body content for our card components instantiated in our app.

_./src/app.svelte_

```diff
  <script lang="ts">
    import { CardComponent } from "./common";
  </script>

  <main>
-   <CardComponent/>
-   <CardComponent/>
+   <CardComponent>
+    <h3>Body Card A</h3>
+   </CardComponent>
+   <CardComponent>
+    <h3>Body Card B</h3>
+   </CardComponent>
  </main>
```

- So far so good, but what if we want to include a new slot for the card heading?
  We can used named slots, let's do some refactor:

_./src/common/card.svelte_

```diff
  <div class="root">
    <!-- header -->
    <div class="card-header">
+     <slot name="header">
        <h2>Default header</h2>
+     </slot>
    </div>
    <!-- body -->
    <div class="card-body">
-     <slot>
+     <slot name="body">
        <h3>Default body</h3>
      </slot>
    </div>
  </div>
```

- Now we got to named slots, let's define them in our card:

_./src/app.svelte_

```diff
  <main>
    <CardComponent>
+     <h2 slot="header">Header Card A</h2>
-     <h3>Body Card A</h3>
+     <h3 slot="body">Body Card A</h3>
   </CardComponent>
   <CardComponent>
+    <h2 slot="header">Header Card B</h2>
-    <h3>Body Card B</h3>
+    <h3 slot="body">Body Card B</h3>
    </CardComponent>
  </main>
```

We can have some additional control:

- Define a default content in case the slot is not informed.
- Pass props between the slot and the parent component.

We will skip this part for this training.
