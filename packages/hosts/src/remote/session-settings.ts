/* @layer core @kind logic */
const settingsYaml = (password?: string) =>
  ['server_options:', `  password: ${password ? JSON.stringify(password) : 'null'}`, ''].join('\n');

export { settingsYaml };
