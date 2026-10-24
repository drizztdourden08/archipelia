/* @layer renderer-app @kind logic */
const tokenSecret = (id: string): string => `lobby-server-${id}-token`;

export { tokenSecret };
