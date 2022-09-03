<script lang="ts">
  import type { Order } from "./order.model";
  import { createNewItem } from "./order.model";

  let order: Order = {
    itemCollection: [
      {
        name: "test",
        quantity: 1,
        price: 20,
      },
    ],
  };

  let subtotal = 0;
  let vat = 0;
  let total = 0;

  $: subtotal = order.itemCollection.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  $: vat = subtotal * 0.21;

  $: total = subtotal + vat;

  export const removeItem = (index) => {
    // Svelte's reactivity is triggered by assignments. Therefore push, pop, slice etc do not work
    order.itemCollection = order.itemCollection.filter((e, i) => i !== index);
  };
</script>

<h1>Order</h1>

<div class="items-container">
  <h3>Name</h3>
  <h3>Qty</h3>
  <h3>Price</h3>
  <h3>Total</h3>
  <h3>Commands</h3>

  {#each order.itemCollection as item, index}
    <input bind:value={item.name} />
    <input bind:value={item.quantity} type="number" />
    <input bind:value={item.price} type="number" />
    {item.price * item.quantity}
    <button on:click={() => removeItem(index)}>Delete</button>
  {/each}
</div>

<div class="add-container">
  <button
    on:click={() =>
      (order.itemCollection = [...order.itemCollection, createNewItem()])}
    >Add</button
  >
</div>

<div class="total-container">
  <h5>Subtotal: {subtotal}</h5>
  <h5>VAT:{vat}</h5>
  <h5>Total: {total}</h5>
</div>

<style>
  .items-container {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr 1fr 1fr;
    gap: 10px;
  }

  .add-container {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    margin-top: 10px;
  }

  .total-container {
    display: flex;
    justify-content: flex-end;
    gap: 50px;
    margin-top: 20px;
  }
</style>
