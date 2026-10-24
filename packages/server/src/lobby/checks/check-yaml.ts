/* @layer core @kind logic */
import type { Failure } from '@archipelia/lobby-protocol';
import { isRecord } from '@archipelia/model';
import type { SlotUpload } from '@archipelia/model';
import { parseAllDocuments } from 'yaml';

const invalid = (slot: SlotUpload, problem: string): Failure => ({ code: 'yaml-invalid', message: `The YAML for ${slot.name} ${problem}.` });

const gameMatches = (game: unknown, wanted: string) =>
  game === wanted || (isRecord(game) && Object.keys(game).length === 1 && Object.keys(game)[0] === wanted);

const checkYaml = (slot: SlotUpload, bytes: Uint8Array | null): Failure | null => {
  if (!bytes) return invalid(slot, 'is missing');
  const documents = parseAllDocuments(new TextDecoder().decode(bytes));
  if (documents.length > 1) return invalid(slot, 'has more than one document');
  const [document] = documents;
  if (!document) return invalid(slot, 'is empty');
  const [error] = document.errors;
  if (error) return invalid(slot, `cannot be read: ${error.message}`);
  const value: unknown = document.toJS();
  if (!isRecord(value)) return invalid(slot, 'is not a player file');
  if (value.name !== slot.name) return invalid(slot, `names the player ${String(value.name)}, not ${slot.name}`);
  if (!gameMatches(value.game, slot.game)) return invalid(slot, `is not for ${slot.game}`);
  return null;
};

export { checkYaml };
