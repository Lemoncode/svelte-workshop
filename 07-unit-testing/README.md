# Summary

# Step By Step Guide

- This example will take a starting point _00-boiler-typescript_

- Let's install the packages.

```bash
npm install
```

- Let's create a plain vanilla function (no markup):

_./src/greet.business.ts_

```ts
export const greetSomebody = (dude: string): string => {
  return `Hello ${dude}!`;
};
```

- And let's create a simple component

_./src/greet.svelte_

```ts
<h1>Hello Human !</h1>
```

- Let's get into the party, first let's install _vitest_
  (this is not needed if you are using svelte kit)

```bash
npm install -D vitest
```

- Let's add some config in our package.json

```diff
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-check --tsconfig ./tsconfig.json",
+   "test": "vitest"
  },
```

- Let's add a simple test to our greet business function.

_./src/greet.business.spec.ts_

```ts
import { greetSomebody } from "./greet.business";

describe("greet business", () => {
  it("should greet somebody", () => {
    expect(greetSomebody("John")).toBe("Hello John!");
  });
});
```

- If we copy this, type definitions are missing, lets install the Jest one
  (yups, vitest syntax is compatible with Jest :)).

```bash
npm install -D @types/jest
```

- If we try to run again we get error, it cannot identify things like
  _describe_ and _it_, let's ask vitest to use globals, let's update our
  vite config:

_./vite.config.ts_

```diff
  import { defineConfig } from 'vite'
  import { svelte } from '@sveltejs/vite-plugin-svelte'

  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [svelte()],
+   test: {
+     globals: true,
+   }
  })
```

We get TypeScript errors on the vite.config why? because test
does not belong to the original _defineConfig_ type, let's inherit
from the original one and extend it:

> [More info](https://stackoverflow.com/questions/72146352/vitest-defineconfig-test-does-not-exist-in-type-userconfigexport)

_./vite.config.ts_

```diff
  import { defineConfig } from "vite";
  import { svelte } from "@sveltejs/vite-plugin-svelte";
+ import type { UserConfig as VitestUserConfigInterface } from 'vitest/config';


+ const vitestConfig: VitestUserConfigInterface = {
+   test: {
+     globals: true
+   }
+ };

  // https://vitejs.dev/config/
  export default defineConfig({
  plugins: [svelte()],
-   test: {
-     globals: true,
-   }
+   test: vitestConfig.test
});
```

- Now we can run the test and we get it passing:

```bash
npm run test
```

- What if we want to add code coverage support? We need to install the following package:

```bash
npm i -D @vitest/coverage-c8
```

- And add the following command to our _package.json_

_./package.json_

```diff
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-check --tsconfig ./tsconfig.json",
-   "test": "npx vitest"
    "test": "npx vitest",
+   "coverage": "vitest run --coverage"
  },
```

- Let's give a try

```bash
npm run coverage
```

- That was nice, is time to start testing components, let's try to test
  our svelte greet component, if you come from the React background we
  have good news for you, there's a testing library for svelte, this means
  all that you have learned from React testing library will be applicable.

If we try to use it, we will get an error:

Let's install testing library:

```bash
npm i -D @testing-library/svelte
```

_./src/greet.spec.ts_

```ts
import { render, screen } from "@testing-library/svelte";
import Greet from "./greet.svelte";

describe("greet component", () => {
  it("should render", () => {
    render(Greet);

    const heading = screen.getByText("Hello Human !");

    expect(heading).toBeInTheDocument();
  });
});
```

```bash
npm run test
```

error: _ReferenceError: document is not defined_

Why and error? Same as with react, when executing tests we have no DOM available so we will have to install jsdom.

```bash
npm install -D @testing-library/jest-dom jsdom
```

- Now we have to indicate in the config that we want to use _jsdom_

_./vite.config.ts_

```diff
  const vitestConfig: VitestUserConfigInterface = {
    test: {
      globals: true,
+     environment: "jsdom",
    },
  };

  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [svelte()],
    test: vitestConfig.test,
  });
```

- Let's run the tests again

```bash
npm run test
```

- Hurray! We got a new error! :-@: _Error: Invalid Chai property: toBeInTheDocument_

We are using Jest matchers not chai, we need to add some extra config
to get this working.

Let's create a setup file:

_./src/setuptest.ts_

```ts
import "@testing-library/jest-dom";
```

And let's indicate in our vite config that we are going to use this
setup file:

_./vite.config.ts_

```diff
  const vitestConfig: VitestUserConfigInterface = {
    test: {
      globals: true,
      environment: "jsdom",
+     setupFiles: ["src/setuptest.ts"],
    },
  };

  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [svelte()],
    test: vitestConfig.test,
  });
```

And now we got it working (you can try changing the _hello human !_ literal
to any other and check that the test is failing).

Let's refactor the greeting component to accept the name of the human to be
greeted:

_./src/greet.svelte_

```diff
+ <script lang="ts">
+  export let name: string;
+ </script>

- <h1>Hello Human !</h1>
+ <h1>Hello {name} !</h1>
```

- Now the test is failing, let's fix it:

_./src/greet.spec.ts_

```diff
import { render, screen } from "@testing-library/svelte";
import Greet from "./greet.svelte";

describe("greet component", () => {
  it("should render", () => {
-   render(Greet);
+   render(Greet, { name: "John" });

-   const heading = screen.getByText("Hello Human !");
+   const heading = screen.getByText("Hello John !");

    expect(heading).toBeInTheDocument();
  });
});
```

# References

[Testing a Svelte app with Vitest](https://blog.logrocket.com/testing-svelte-app-vitest/)

[Test Svelte kit](https://www.youtube.com/watch?v=5bQD3dCoyHA&ab_channel=JohnnyMagrippis)
