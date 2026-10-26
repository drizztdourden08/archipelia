/* @layer renderer-app @kind logic */
import type { CardHandlers, GameRow } from '../GameStore.type';
import { removeKey } from './remove-key';

const failureWire = ({ entry }: GameRow, { errorOf }: CardHandlers): string | undefined =>
  errorOf(entry.apworld) ?? errorOf(removeKey(entry.apworld)) ?? undefined;

export { failureWire };
