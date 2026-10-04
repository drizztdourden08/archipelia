/* @layer renderer-app @kind logic */
import type { JsonValue } from '@archipelia/model';
import { isLoose } from './is-loose';

const isJson = (raw: unknown): raw is JsonValue => {
  if (raw === null || ['string', 'number', 'boolean'].includes(typeof raw)) return true;
  if (Array.isArray(raw)) return raw.every(isJson);
  return isLoose(raw) && Object.values(raw).every(isJson);
};

export { isJson };
