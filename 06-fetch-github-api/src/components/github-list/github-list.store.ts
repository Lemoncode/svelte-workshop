import { writable } from "svelte/store";
import { setContext, getContext } from "svelte";
import { v4 as uuidv4 } from "uuid";
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

// Another option: https://github.com/rozek/locally-unique-id-generator/blob/main/README.md
const membersContextUID = uuidv4();

export const setMembersContext = (membersStore: MembersStore) =>
  setContext(membersContextUID, membersStore);

export const getMembersContext = () =>
  getContext<MembersStore>(membersContextUID);
