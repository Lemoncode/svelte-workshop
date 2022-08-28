import type { UserEntity } from "./model";
import { writable } from "svelte/store";

export const userInfoStore = writable<UserEntity>({
  username: "default user",
});
