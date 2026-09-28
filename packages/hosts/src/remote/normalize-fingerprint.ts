/* @layer core @kind logic */
import { PREFIX } from './host-key.constants';

const normalizeFingerprint = (value: string) => {
  const bare = value.trim().replace(/=+$/, '');
  return bare.startsWith(PREFIX) ? bare : `${PREFIX}${bare}`;
};

export { normalizeFingerprint };
