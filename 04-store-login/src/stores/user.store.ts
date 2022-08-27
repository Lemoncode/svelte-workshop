import { writable } from "svelte/store";

export const userInfoStore = writable({
  username: "no user logged in",
});
