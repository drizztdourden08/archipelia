/* @layer renderer-app @kind logic */
const historyLabel = (count: number): string => `History of this session (${count} ${count === 1 ? 'run' : 'runs'})`;

export { historyLabel };
