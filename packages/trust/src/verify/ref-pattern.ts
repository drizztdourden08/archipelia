/* @layer core @kind logic */
import { escapePattern } from './escape-pattern';
import { REF_TAIL, REF_WILDCARD } from './escape-pattern.constants';

const refPattern = (ref: string) =>
  ref.endsWith(REF_WILDCARD) ? `${escapePattern(ref.slice(0, -REF_WILDCARD.length))}${REF_TAIL}` : escapePattern(ref);

export { refPattern };
