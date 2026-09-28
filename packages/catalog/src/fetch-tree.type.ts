/* @layer core @kind types */

type TreeFile = { path: string; sha: string };

type TreeResponse = { truncated: boolean; tree: { path: string; type: string; sha: string }[] };

export type { TreeFile, TreeResponse };
