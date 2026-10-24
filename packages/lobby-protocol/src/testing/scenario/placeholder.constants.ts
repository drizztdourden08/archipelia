/* @layer testing @kind config */
import type { Wildcard } from './scenario.type';

const PLACEHOLDER = /^\$([A-Za-z][A-Za-z0-9_]*)$/;

const WILDCARDS: Record<string, Wildcard> = {
  any_int: { accepts: (value) => typeof value === 'number' && Number.isInteger(value), sample: 1 },
  any_num: { accepts: (value) => typeof value === 'number', sample: 0.5 },
  any_str: { accepts: (value) => typeof value === 'string' && value.length > 0, sample: 'sample' },
  any_tls: { accepts: (value) => value === 'yes' || value === 'no' || value === 'auto', sample: 'auto' },
  data: { accepts: (value) => typeof value === 'string', sample: 'AAAA' },
  bad_data: { accepts: (value) => typeof value === 'string', sample: 'AAAA' },
};

export { PLACEHOLDER, WILDCARDS };
