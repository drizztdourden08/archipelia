/* @layer core @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import { parseAllDocuments } from 'yaml';

const renderImportedYaml = (player: SessionPlayer, yaml: string) => {
  const documents = parseAllDocuments(yaml);
  const [document] = documents;
  if (documents.length !== 1 || !document) throw new Error(`${player.name}: an imported file must hold exactly one player`);
  const [error] = document.errors;
  if (error) throw new Error(`${player.name}: ${error.message}`);
  document.set('name', player.name);
  return document.toString();
};

export { renderImportedYaml };
