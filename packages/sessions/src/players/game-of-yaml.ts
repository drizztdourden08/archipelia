/* @layer core @kind logic */
import { parseAllDocuments } from 'yaml';

const gameOfYaml = (yaml: string): string | undefined => {
  const [document] = parseAllDocuments(yaml);
  const game = document?.get('game');
  return typeof game === 'string' ? game : undefined;
};

export { gameOfYaml };
