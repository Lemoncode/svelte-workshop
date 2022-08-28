import type { UserEntity } from "./model";
import { writable } from "svelte/store";

export const createUserInfoStore = () =>
  writable<UserEntity>({
    username: "Seed name " + Math.random(),
  });
