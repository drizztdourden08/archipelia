/* @layer client-kit @kind logic */
import type { KitIssue } from '../errors/kit-issue.type';
import { FORBIDDEN_SLOT_CHARS, MAX_SLOT_NAME_LENGTH } from './player-yaml.constants';

const checkSlotName = (slotName: string): KitIssue[] => {
  const issue = (message: string): KitIssue[] => [{ key: 'slotName', code: 'bad-slot-name', message }];
  if (typeof slotName !== 'string' || slotName === '') return issue('slotName must be a non-empty text.');
  if (slotName !== slotName.trim()) return issue('slotName must not start or end with a space.');
  if ([...slotName].length > MAX_SLOT_NAME_LENGTH) {
    return issue(`slotName "${slotName}" is longer than ${MAX_SLOT_NAME_LENGTH} characters, which Archipelago cuts.`);
  }
  if (FORBIDDEN_SLOT_CHARS.test(slotName)) return issue('slotName must not hold control characters, "{" or "}".');
  return [];
};

export { checkSlotName };
