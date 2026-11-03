/* @layer renderer-app @kind logic */
const problemsLabel = (count: number): string => `${count} ${count === 1 ? 'problem' : 'problems'}`;

export { problemsLabel };
