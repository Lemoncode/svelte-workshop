import type { GithubMember } from "./model";

export const fetchGithubMembers = async (
  organization: string
): Promise<GithubMember[]> => {
  const response = await fetch(
    `https://api.github.com/orgs/${organization}/members`
  );
  return response.json();
};
