/* @layer renderer-app @kind logic */
const validPort = (port: number) => Number.isInteger(port) && port > 0 && port < 65536;

export { validPort };
