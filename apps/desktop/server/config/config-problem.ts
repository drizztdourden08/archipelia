/* @layer server @kind logic */
class ConfigProblem extends Error {
  constructor(key: string, message: string) {
    super(`${key}: ${message}`);
    this.name = 'ConfigProblem';
  }
}

export { ConfigProblem };
