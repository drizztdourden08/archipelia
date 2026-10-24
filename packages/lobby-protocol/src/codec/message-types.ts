/* @layer protocol @kind logic */
import type { Direction } from '../protocol/protocol.type';
import { CLIENT_SCHEMAS, SERVER_SCHEMAS } from '../schemas/message-schemas';
import type { Schema } from '../validate/validate.type';

const schemaFor = (direction: Direction, type: string): Schema | null => {
  const table: Record<string, Schema> = direction === 'c2s' ? CLIENT_SCHEMAS : SERVER_SCHEMAS;
  return Object.hasOwn(table, type) ? (table[type] ?? null) : null;
};

export { schemaFor };
