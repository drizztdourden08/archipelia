/* @layer renderer-app @kind logic */
const passwordSecret = (id: string) => `server-${id}-password`;

export { passwordSecret };
