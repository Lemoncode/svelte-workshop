# Summary

In this example we will get started using properties and bindings.

We will build a simple color picker control, we will:

- Create a single componente that edit a single color componente.
- A custom component that will group three single color componentes.
- A colorBrowser that will display the color it self.
- A colorPicker that will group all this components.

# Step By Step Guide

- This example takes as starting point _00-scratch-typescript_, let's
  copy the project and execute an _npm install_

```bash
npm install
```

- Let's create a subfolder that will hold all the color picker
  components.

```bash
md color-picker
```

- Time to create a single color slider edit component, we will use
  two way binding to bind the _value_ property with the input _value_
  property (this is ok to be used in a local scope, we could use
  the React approach well, one way + callback), things to take into consideration:

  - We define _props_ by _exporting_ them on the script area (check _export let name_
    and _export let value_
  - One way binding works in a very similar was a with React (brackets)
  - We can decide here whether to use one way binding and hooking on change
    like events or use two way binding (this can be ok meanwhile the binding is
    contained in the same component scope).

_./color-picker/single-color-editor.svelte_

```svelte
<script lang="ts">
  export let name = "";
  export let value = 0;
</script>

<label for="color">{name}</label>
<input id="color" type="range" min="0" max="255" bind:value />
```

Now let's wipe the main app and let's test this component.

_./App.svelte_

```svelte
<script lang="ts">
  import SingleColorEditor from "./color-picker/single-color-editor.svelte";
  let red = 128;
</script>

<main class="root">
  <SingleColorEditor name="Red" value={red} />
  {red}
</main>
```

If we give a try to this we can check that the slider gets updated _but the
parent *red* value does not_, what's going on? Well if we are used to react
this could be pretty standard, the property is passed down as read only.

What can we do? A possible solution is to use two way binding between
components, something like:

_./src/App.svelte_

```diff
<main class="root">
  <SingleColorEditor
    name="Red"
-    value={red}
+    bind:value={red}
  />
  {red}
</main>
```

** BAD SMELL **

Although this can look like a simple solution, it could lead us to issues in
more complex scenarios, usually we will use two way binding in a local scope,
when we involve this automatic updated in between components we can loose
control of our application logic.

So let's ditch this approach, and check for an alternate solution to this problem.

Let's go for the one React developers will be more familiar, let's add a callback
property that will return the new value:

First let's roll back the two way binding previous update.

_./src/App.svelte_

```diff
<main class="root">
  <SingleColorEditor
    name="Red"
+    value={red}
-    bind:value={red}
  />
  {red}
</main>
```

And let's provide a callback property to the component:

_./color-picker/single-color-editor.svelte_

```diff
<script lang="ts">
 export let name = ""
 export let value= 0;
+ export let onChange : (value: number) => void;
</script>

<label for="color">{name}</label>
<input id="color" type="range" min="0" max="255" bind:value
+ on:input={(e) => onChange(+e.currentTarget.value)}
/>
```

And on the app component:

_./App.svelte_

```diff
<script lang="ts">
  import SingleColorEditor from './color-picker/single-color-editor.svelte';

  let red = 128;

+ const onChange = (value: number) => {
+   red = value;
+ }
</script>

<main class="root">
  <SingleColorEditor
    name="Red"
    value={red}
+    onChange={onChange}
  />
  {red}
</main>
```

That was cool, specially if we come from a React background, buuut Svelte offers us another flavor more Vue style, and event dispatcher, let's give a try:

In our child component we will instantiate a new event dispatcher (this must be
called before the component is instantiated).

_./color-picker/single-color-editor.svelte_

```diff
<script lang="ts">
+ import { createEventDispatcher } from 'svelte';

 export let name = ""
 export let value= 0;
- export let onChange = (value: number) => {};

+ const dispatch = createEventDispatcher<{valuechange: number}>();
</script>
```

Now on let's dispatch the value-change event:

```diff
<input id="color" type="range" min="0" max="255" bind:value
-  on:input={(e) => onChange(+e.currentTarget.value)}
+  on:input={(e) => dispatch('valuechange', +e.currentTarget.value)}
/>
```

And on the app component let's listen for the dispatcher
(more about typing dispatcher: https://github.com/sveltejs/language-tools/issues/424):

_./App.svelte_

```diff
<script lang="ts">
  import SingleColorEditor from './color-picker/single-color-editor.svelte';

  let red = 128;
-  const onChange = (value: number) => {
-   red = value;
-  }

+  function handleValueChanged(event : CustomEvent<number>) {
+    // Just in case we want to reuse this for more than one event
+    if (event.type === 'valuechange') {
+      red = event.detail
+    }
+  }
</script>

<main class="root">
  <SingleColorEditor
    name="Red"
    value={red}
-    onChange={onChange}
+    on:valuechange={handleValueChanged}
  />
  {red}
</main>
```

> More info about typing component events: https://github.com/sveltejs/language-tools/blob/master/docs/preprocessors/typescript.md#typing-component-events

Now a question may arise... what if I want to bubble up a dispatch event to an ancestor
that is not direct, do I have to recreate a dispatcher per event? The answer is NO,
Svelte offers a shortcut for this (on:mMessage, more info: https://svelte.dev/tutorial/event-forwarding):

Let's keep on building our component, we got one slider for the red component, but we
need two more, let's create a super component that will instantiate the three
color components.

_./color-picker/color-editor.svelte_

```svelte
<script lang="ts">
  import SingleColorEditor from "./single-color-editor.svelte";

  let red = 128;
  let green = 128;
  let blue = 128;

  const handleValueChanged = () => {
    console.log("handleValueChanged");
  };
</script>

<div class="root">
  <SingleColorEditor
    name="Red"
    value={red}
    on:valuechange={handleValueChanged}
  />

  <SingleColorEditor
    name="Green"
    value={green}
    on:valuechange={handleValueChanged}
  />

  <SingleColorEditor
    name="Blue"
    value={blue}
    on:valuechange={handleValueChanged}
  />
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
```

Ok, good start... but what if we want to use the same dispatcher for all the single components? Let's add an extra params to the dispatcher payload in the single editor component:

This time we are going to use an elaborated payload with a name and value property, let's define it an interface:

_./color-picker/model.ts_

```ts
export interface ValueChangePayload {
  name: string;
  value: number;
}
```

_./color-picker/single-color-editor.svelte_

```diff
<script lang="ts">
 import { createEventDispatcher } from 'svelte';
+ import type { ValueChangePayload } from './model';
 export let name = ""
 export let value= 0;

- const dispatch = createEventDispatcher<{valuechange: number}>();
+  const dispatch = createEventDispatcher<{valuechange: ValueChangePayload}>();
</script>

<label for="color">{name}</label>
<input id="color"
        type="range"
        min="0"
        max="255"
        bind:value
-        on:input={(e) => dispatch('valuechange', +e.currentTarget.value)}
+        on:input={(e) => dispatch('valuechange', {name: name, value: +e.currentTarget.value})}

/>
```

And in the main editor:

_./src/color-picker/color-editor.svelte.ts_

```diff
+ import type { ValueChangePayload } from './single-color-editor.svelte';
// ...

-  const handleValueChanged = () => {
+  const handleValueChanged =(eventInfo: CustomEvent<ValueChangePayload>) => {
-    console.log('handleValueChanged');
+    console.log(eventInfo.detail.name, eventInfo.detail.value);
  }
</script>
```

Let's use this color editor in our main app component:

_./src/app.svelte_

```diff
<script lang="ts">
+  import ColorEditor from './color-picker/color-editor.svelte';
-  import SingleColorEditor from './color-picker/single-color-editor.svelte';

-  let red = 128;

-  function handleValueChanged(event : CustomEvent<number>) {
-    // Just in case we want to reuse this for more than one event
-    if (event.type === 'valuechange') {
-      red = event.detail
-    }
-  }
</script>

<main class="root">
+  <ColorEditor/>
-  <SingleColorEditor
-    name="Red"
-    value={red}
-    on:valuechange={handleValueChanged}
-  />
-  {red}
</main>
```

- That was cool, we got the event typed and all that jazz, but we are not consuming that in our main app :), let's expose the _red_ _green_ _blue_ variables as props:

_./src/color-editor.svelte_

```diff
<script lang="ts">
  import SingleColorEditor from './single-color-editor.svelte'

-  let red = 128;
-  let green = 128;
-  let blue = 128;
+  export let red = 128;
+  export let green = 128;
+  export let blue = 128;
```

And let's use the props in our main app component:

_./src/app.svelte_

```diff
<script lang="ts">
  import ColorEditor from './color-picker/color-editor.svelte';
+ let red = 50;
+ let blue = 200;
+ let green = 10;
</script>

<main class="color">
-  <ColorEditor/>
+  <ColorEditor red={red} green={green} blue={blue}/>
+  {red} {green} {blue}
</main>
```

Not bad, values are display in each of the slider buuuut they changes are not reflected in the app
component, we need to bubble up the event to the app component, in order to avoid creating an intermediate
dispatcher on our color editor, we can take a shortcut, use event forwarding: https://svelte.dev/tutorial/event-forwarding

Let's go for that, we just simplify _color-editor_ we are not going to delegate the _valueChange_ event
handling to the parent component.

_./src/color-editor.svelte_

```diff
<script lang="ts">
  import SingleColorEditor from './single-color-editor.svelte'

  export let red = 128;
  export let green = 128;
  export let blue = 128;

-  const handleValueChanged = (eventInfo:  CustomEvent<{name: string, value: number}>) => {
-    console.log(eventInfo.detail.name, eventInfo.detail.value);
-  }

</script>


<div class="root">
  <SingleColorEditor
    name="Red"
    value={red}
-    on:valuechange={handleValueChanged}
+    on:valuechange
/>

    <SingleColorEditor
    name="Green"
    value={green}
-    on:valuechange={handleValueChanged}
+    on:valuechange
/>

    <SingleColorEditor
    name="Blue"
    value={blue}
-    on:valuechange={handleValueChanged}
+    on:valuechange
/>
</div>
```

And on the main app:

_./src/app.svelte_

```diff
<script lang="ts">
+  import type { ValueChangePayload } from './color-picker/model';
  import ColorEditor from './color-picker/color-editor.svelte';
  let red = 50;
  let blue = 200;
  let green = 10;

+  const handleValueChanged = (eventInfo:  CustomEvent<ValueChangePayload>) => {
+    switch (eventInfo.detail.name) {
+      case 'Red':
+        red = eventInfo.detail.value;
+        break;
+      case 'Green':
+        green = eventInfo.detail.value;
+        break;
+      case 'Blue':
+        blue = eventInfo.detail.value;
+    }
+  }
</script>

<main class="root">
  <ColorEditor
    red={red}
    green={green}
    blue={blue}
+   on:valuechange={handleValueChanged}
  />
  {red} {green} {blue}
</main>
```

> We have used single variables for each component just to show the forward event handling, we could
> encapsulate this values in an object (color={red, green, blue}) and get our code simpler, if you
> want to give a try it could be a good exercise to try it out.

Now let's create a _color-display_ that will show the current color we are displaying (if you want you can try and take this as an excercise):

_./src/color-picker/color-display.svelte_

```svelte
<script lang="ts">
  export let red = 128;
  export let green = 128;
  export let blue = 128;
</script>

<div
  class="color-display"
  style="background-color: rgb({red}, {green}, {blue})"
/>

<style>
  .color-display {
    width: 200px;
    height: 200px;
  }
</style>
```

And let's instantiate it in our app main component:

_./src/app.svelte_

```diff
<script lang="ts">
+  import type { ValueChangePayload } from './color-picker/model';
+ import ColorDisplay from './color-picker/color-display.svelte';
  import ColorEditor from './color-picker/color-editor.svelte';
  let red = 50;
  let blue = 200;
  let green = 10;

  const handleValueChanged = (eventInfo:  CustomEvent<ValueChangePayload>) => {
    switch (eventInfo.detail.name) {
      case 'Red':
        red = eventInfo.detail.value;
        break;
      case 'Green':
        green = eventInfo.detail.value;
        break;
      case 'Blue':
        blue = eventInfo.detail.value;
    }
  }
</script>

<main class="root">
+  <div class="display">
+      <ColorDisplay red={red} green={green} blue={blue}/>
+          R: {red},
+          G: {green},
+          B: {blue}
+  </div>
  <ColorEditor red={red} green={green} blue={blue}
  on:valuechange={handleValueChanged}/>
-  {red} {green} {blue}
</main>

+ <style>
+ 	.root {
+ 		display: flex;
+ 		gap: 50px;
+ 	}
+
+ 	.display {
+ 		display: flex;
+ 		flex-direction: column;
+ 		gap: 20px;
+ 		align-items: space-between;
+ 	}
+ </style>
```

## Appendix TypeScript Magic

Sometimes defining interfaces for the payload and consuming it in the parent components can be a bit tedious,
maybe we could go easy, just extract the events payload from the component, let's see how:

_./src/tools/extract-event-payload.ts_

```ts
import type { SvelteComponentTyped } from "svelte";

export type EventsHandlers<Component> = Component extends SvelteComponentTyped<
  unknown,
  infer EventsMap,
  unknown
>
  ? {
      [Event in keyof EventsMap]: (e: EventsMap[Event]) => void;
    }
  : never;
```

Now let's go to the app component, we don't need to import the interface:

_./src/app.ts_

```diff
<script lang="ts">
+  import type {EventsHandlers} from './tools/extract-event-payload';
-  import type { ValueChangePayload } from "./color-picker/model";
  import ColorDisplay from "./color-picker/color-display.svelte";
  import ColorEditor from "./color-picker/color-editor.svelte";
  let red = 50;
  let blue = 200;
  let green = 10;

+  type ColorEditorEventHandlers = EventsHandlers<ColorEditor>;

-  const handleValueChanged = (
+  const handleValueChanged : ColorEditorEventHandlers['valuechange']  = (

    eventInfo: CustomEvent<ValueChangePayload>

  ) => {
```

## Excercise

And to wrap all this why not creating a _ColorPicker_ component that will bring together the
color browser and the editor in one?
