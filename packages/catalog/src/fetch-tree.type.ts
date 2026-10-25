/* @layer core @kind types */

type TreeFile = { path: string; sha: string };

type TreeNode = { path: string; type: string; sha: string };

type TreeResponse = { truncated: boolean; tree: TreeNode[] };

export type { TreeFile, TreeNode, TreeResponse };
