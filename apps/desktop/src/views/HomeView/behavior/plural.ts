/* @layer renderer-app @kind logic */
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

export { plural };
