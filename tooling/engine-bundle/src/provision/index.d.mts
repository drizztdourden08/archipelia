type EngineProvisionWorktree = { main: string; userData: string; log: (message: string) => void };

declare const engineProvision: () => { name: string; run: (worktree: EngineProvisionWorktree) => Promise<void> };

export { engineProvision };
export type { EngineProvisionWorktree };
