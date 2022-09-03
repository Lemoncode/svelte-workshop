import { writable } from "svelte/store";
import { fetchGithubMembers } from "./github.api";
import type { GithubMember } from "./model";

export const createGithubMembersStore = () => {
  const { set, subscribe, update } = writable<GithubMember[]>([]);
  let isLoading = false;

  const loadMembers = (organizationName) => {
    isLoading = true;
    fetchGithubMembers(organizationName)
      .then((result) => {
        isLoading = false;
        set(result);
      })
      .catch((error) => {
        isLoading = false;
        set([]);
      });
  };

  return { subscribe, loadMembers, isLoading };
};

export type MembersStore = ReturnType<typeof createGithubMembersStore>;
