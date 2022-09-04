# Summary

In this example we will create a project from scratch using _vite_
and then add support for _TypeScript_

# Step By Step Guide

First let's create our project, we will call it "example-app":

```bash
npm init vite
```

Let's let the vite tooling install then you will go through a guided process:

- First choose the right project name, e.g. "example-app"

- Then choose the framework, in this case _svelte_ and as a variant
  _svelte-ts_

A folder has been created (e.g. "example-app"), now you can:

```bash
cd example-app
```

```bash
npm install
```

```bash
npm run dev
```

- Just one more thing to wrap up this example, to enhance your development
  experience, I encourage you to install the following VS Code plugins:

- [Svelte for Vs Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
- [Svelte Intellisense](https://marketplace.visualstudio.com/items?itemName=ardenivanov.svelte-intellisense)

- And if you use prettier is a good idea to install an additional package
  to get a good prettier integration when formatting code:

```bash
npm install prettier-plugin-svelte -D
```
