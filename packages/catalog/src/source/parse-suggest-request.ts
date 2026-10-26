/* @layer core @kind logic */
import type { SuggestRequest } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { SAFE_WORLD } from '../enrich/enrich.constants';
import { MAX_PASTE_CHARS, MODULE_NAME } from './source.constants';

const shortText = (value: unknown): string | undefined => (typeof value === 'string' && value.length <= MAX_PASTE_CHARS && value.trim() !== '' ? value : undefined);

const parseSuggestRequest = (value: unknown): SuggestRequest => {
  const input: Record<string, unknown> = isRecord(value) ? value : {};
  const { apworld, module, linked, paste } = input;
  if (typeof apworld !== 'string' || !SAFE_WORLD.test(apworld) || typeof module !== 'string' || !MODULE_NAME.test(module)) {
    throw new Error('That package request is not valid.');
  }
  return { apworld, module, linked: shortText(linked), paste: shortText(paste) };
};

export { parseSuggestRequest };
