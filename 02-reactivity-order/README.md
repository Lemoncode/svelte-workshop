# Summary

In this example we are going to cover some reactivity basic topics.

We will simulate a simple order system, and we will calculate total, subtotal and tax.

# Step By Step Guide

- We will take as starting point: _00-boiler-typescript_, let's copy the content of that folder and
  execute

```bash
npm install
```

- Let's create in `/src` a subfolder called _orders_

```bash
md src/orders
```

- First we are going to define the order model:

_./src/order.model.ts_

```typescript
export interface Item {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  itemCollection: Item[];
}

export const createNewItem = (): Item => ({
  name: "",
  quantity: 1,
  price: 20,
});
```

Let's define now the order component, we will start with something simple:

_./src/orders/order.svelte_

```svelte
<h1>Order</h1>
```

Let's define a barrel for the _orders_ subfolder.

_./src/orders/index.ts_

```typescript
export { default as OrderComponent } from "./order.svelte";
```

And let's consume it in our _app_ file just to ensure that we have wired up the basics, we will just
replace the whole content

_./src/App.svelte_

```svelte
<script lang="ts">
  import { OrderComponent } from "./orders";
</script>

<main>
  <OrderComponent />
</main>

<style>
</style>
```

- Let's give a try and ensure that this basic skeleton is working:

```bash
npm run dev
```

- Time to come back and start adding some functionality to our order component, let's import the interfaces and factory
  from the _order.model_, add some mock data and define some variables to hold the calculated fields (subtotal, vat, price).

_./src/orders/order.svelte_

```diff
+ <script lang="ts">
+   import type { Order, Item } from "./order.model";
+   import { createNewItem } from "./order.model";
+
+   let order: Order = {
+      itemCollection: [
+        {
+          name: 'test',
+          quantity: 1,
+          price: 0
+        }
+      ]
+    };
+
+   let subtotal = 0;
+   let vat = 0;
+   let total = 0;
+ </script>
  <h1>Order Component</h1>
```

- Cool let's show the data..., we will use the _#each_ directive to iterate over the items and display them.

_./src/orders/order.svelte_

```diff
  <h1>Orders</h1>
+ {#each order.itemCollection as item, index (index)}
+   <span>{item.name}</span>
+   <span>{item.quantity}</span>
+   <span>{item.price}</span>
+   <span>here goes total</span>
+   <button>Delete</button>
+ {/each}
```

- If we run the example, we can check that the data is being shown although the layout looks a bit ugly, let's add some styling, we will add a grid layout and create a header section.

_./src/orders/order.svelte_

```diff
+ <div class="items-container">
+   <h3>Name</h3>
+   <h3>Qty</h3>
+   <h3>Price</h3>
+   <h3>Total</h3>
+   <h3>Commands</h3>

    {#each order.itemCollection as item, index}
      <span>{item.name}</span>
      <span>{item.quantity}</span>
      <span>{item.price}</span>
      <span>here goes total</span>
      <button>Delete</button>
    {/each}
+ </div>

+ <style>
+  .items-container {
+    display: grid;
+    grid-template-columns: 2fr 1fr 2fr 1fr 1fr;
+    gap: 10px;
+  }
+ </style>
```

- Let's start the project again and check that the layout starts to look nicer.

- Is time prepare the edit mode:

_./src/orders/order.svelte_

```diff
  {#each order.itemCollection as item, index}
-   <span>{item.name}</span>
-   <span>{item.quantity}</span>
-   <span>{item.price}</span>
+   <input bind:value={item.name}/>
+   <input bind:value={item.quantity} type="number"/>
+   <input bind:value={item.price} type="number"/>
    <span>here goes total</span>
    <button>Delete</button>
  {/each}
```

Not bad, in this case we just benefit from the binding two way, that's ok because we are on a local scope.

- Time to calculate the total amount for each item, easy pc (very similar to React in this case):

```diff
  <input bind:value={item.name}/>
  <input bind:value={item.quantity} type="number"/>
  <input bind:value={item.price} type="number"/>
- <span>here goes total</span>
+ {item.price * item.quantity}
  <button>Delete</button>
```

If you give a try you will check that the total is being calculated.

- Now let's implement the delete button, we will use the _#on:click_ directive to remove the item from the list,
  in this case we have to take care, in order to notify svelte we need to make an assignment (we cannot just
  simple remove that item from array in a mutable way).

```diff
    let subtotal = 0;
    let vat = 0;
    let total = 0;

+   export const removeItem = (item: Item) => {
+     // Svelte's reactivity is triggered by assignments. Therefore push, pop, splice etc do not work
+     order.itemCollection = order.itemCollection.filter((e) => e !== item);
+   }
  </script>


  // (...)
      <input bind:value={item.name}/>
      <input bind:value={item.quantity} type="number"/>
      <input bind:value={item.price} type="number"/>
      {item.price * item.quantity}
-     <button>Delete</button>
+     <button on:click={() => removeItem(item)}>Delete</button>
```

If you give a try you will realize that... we have removed the only item we had on the list.

- Let's add an option to add more items to the order list:

_./src/order/order.svelte_

```diff
     <button on:click={() => removeItem(index)}>Delete</button>
   </div>
+  <div class="add-container">
+    <button on:click={() => order.itemCollection = [...order.itemCollection, createNewItem()]}>Add</button>
+  </div>

  <style>
    .items-container {
      display: grid;
      grid-template-columns: 2fr 1fr 2fr 1fr 1fr;
      gap: 10px;
    }

+  .add-container {
+    display: flex;
+    align-items: flex-end;
+    flex-direction: column;
+    margin-top: 10px;
+  }
  </style>
```

We are just assigning a new array that contains the old array and the new item.

Let's play a little bit with reactivity and assigments, if we try this
what would happen?

```diff
  <div class="add-container">
-   <button on:click={() => order.itemCollection = [...order.itemCollection, createNewItem()]}>Add</button>
+   <button
+     on:click={() => {
+       order.itemCollection.push(createNewItem());
+     }}
+   >Add</button>
  </div>
```

It wont' work because there's no assignment and svelte does not notice about the
update, but what if we try something like?

```diff
  <button
    on:click={() => {
      order.itemCollection.push(createNewItem());
+     order.itemCollection = order.itemCollection;
    }}
  >Add</button>
```

It works, there is an assignment... but what an ugly code :D

It's time to calculate the subtotal (all items qty \* price but no tax included), the taxes to be paid, and the
total (subtotal + taxes).

- First let's add some markup to display the subtotal, the vat and the total:

_./src/orders/order.svelte_

```diff
  <div class="add-container">
    <button on:click={() => order.itemCollection = [...order.itemCollection, createNewItem()]} >Add</button>
  </div>

+ <div class="total-container">
+   <h5>Subtotal: {subtotal}</h5>
+   <h5>VAT: {vat}</h5>
+   <h5>Total: {total}</h5>
+ </div>

  <styles>
    // (...)
+   .total-container {
+     display: flex;
+     justify-content: flex-end;
+     gap: 50px;
+     margin-top: 20px;
+   }
  </styles>
```

- Now comes the magic, using the _$:_ directive we are just indicating the app to reevaluate this assignment whenever any the
  variables on the right side of the assignment are changed.

_./src/orders/order.svelte_

```diff
  let subtotal = 0;
  let vat = 0;
  let total = 0;

+ $: subtotal = order.itemCollection.reduce((acc, item) => {
+   return acc + (item.price * item.quantity);
+ }, 0);
+
+ $: vat = subtotal * 0.21;
+
+ $: total = subtotal + vat;
```

- Now we can start adding items and check

If you run the app, you can see how we can update any item in the list (or add, remove) and automatically all the calcs are updated.

- Additional syntax sugar, we can remove the totals variables declarations:

```diff
-  let subtotal = 0;
-  let vat = 0;
-  let total = 0;
```
