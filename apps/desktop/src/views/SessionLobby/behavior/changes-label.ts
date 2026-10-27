/* @layer renderer-app @kind logic */
const changesLabel = (count: number): string => `${count} ${count === 1 ? 'change' : 'changes'} from saved`;

export { changesLabel };
