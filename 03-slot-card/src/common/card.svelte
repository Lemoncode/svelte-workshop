<div class="root">
  <!-- header -->
  <div class="card-header">
    <slot name="header">
      <h2>Default header</h2>
    </slot>
  </div>
  <!-- body -->
  <div class="card-body">
    <slot name="body">
      <h3>Default body</h3>
    </slot>
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
