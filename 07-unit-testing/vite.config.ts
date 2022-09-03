import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import type { UserConfig as VitestUserConfigInterface } from "vitest/config";

const vitestConfig: VitestUserConfigInterface = {
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/setuptest.ts"],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  test: vitestConfig.test,
});
