/* @layer core @kind logic */
import { dropComments } from './drop-comments';
import { ACTIVE, ENTITIES, INLINE_RULES, TAG } from './strip-inline.constants';

const stripInline = (line: string): string => {
  let text = dropComments(line).replace(ACTIVE, ' ').replace(TAG, ' ');
  for (const [pattern, replacement] of INLINE_RULES) text = text.replace(pattern, replacement);
  for (const [entity, char] of ENTITIES) text = text.replaceAll(entity, char);
  return text.replace(/\s+/g, ' ').trim();
};

export { stripInline };
