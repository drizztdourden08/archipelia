/* @layer core @kind logic */

const commandOf = (python: string, owner: string, repo: string, sha: string): string =>
  `"${python}" -m pip install "git+https://github.com/${owner}/${repo}@${sha}"`;

export { commandOf };
