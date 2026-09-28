/* @layer renderer-app @kind logic */
const yamlFileName = (name: string) => `${name.replace(/[\\/:*?"<>|]+/g, '-').trim() || 'preset'}.yaml`;

export { yamlFileName };
