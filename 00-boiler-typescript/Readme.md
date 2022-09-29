# Summary

In this example, we will create a project from scratch using _vite\_\_
choosing \_TypeScript_ as the language, and install svelte prettier plugin.

# Step By Step Guide

First let's create our project, we will call it "example-app",

```bash
npm init vite
```

Let's let install the vite tooling, then we will go through a guided process:

- First choose the right project name, e.g. "example-app"

- Then choose the framework, in this case _svelte_ and choose the typescript
  option

A folder has been created (e.g. "example-app"), now you can dive into it
and execute _npm install_ and execute _npm run dev_ to start the dev server.

```bash
cd example-app
```

```bash
npm install
```

```bash
npm run dev
```

# IMPORTANT ADDITIONAL STEPS

- Just one more thing to wrap up this example, to enhance your development
  experience, I encourage you to install the following VS Code plugins:

- [Svelte for Vs Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

- [Svelte Intellisense](https://marketplace.visualstudio.com/items?itemName=ardenivanov.svelte-intellisense)

- And if you use prettier is a good idea to install an additional package
  to get a good prettier integration when formatting code:

```bash
npm install prettier-plugin-svelte -D
```
