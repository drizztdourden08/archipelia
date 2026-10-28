/* @layer renderer-app @kind logic */
const changesText = (count: number): string => `${count} unsaved ${count === 1 ? 'change' : 'changes'}`;

export { changesText };
