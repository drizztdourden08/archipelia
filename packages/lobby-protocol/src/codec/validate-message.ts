/* @layer protocol @kind logic */
import type { Direction } from '../protocol/protocol.type';
import type { SchemaProblem } from '../validate/validate.type';
import { isRecord } from '../validate/is-record';
import { validateSchema } from '../validate/validate-schema';
import { schemaFor } from './message-types';

const validateMessage = (direction: Direction, message: unknown): SchemaProblem[] => {
  if (!isRecord(message) || typeof message.type !== 'string') {
    return [{ path: 'type', message: 'the message has no type' }];
  }
  const schema = schemaFor(direction, message.type);
  if (schema === null) return [{ path: 'type', message: `the type ${message.type} is not known` }];
  return validateSchema(schema, message);
};

export { validateMessage };
