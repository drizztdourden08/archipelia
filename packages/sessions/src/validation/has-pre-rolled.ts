/* @layer core @kind logic */
import { parseAllDocuments } from 'yaml';
import { PRE_ROLLED_KEY } from '@archipelia/model';

const hasPreRolled = (yaml: string, game: string): boolean => {
  const [document] = parseAllDocuments(yaml);
  const block = document?.getIn([game, PRE_ROLLED_KEY]);
  return block !== undefined && block !== null;
};

export { hasPreRolled };
