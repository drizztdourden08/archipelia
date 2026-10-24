/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { isText } from './is-text';
import { isTextList } from './is-text-list';
import { parseTrust } from './parse-trust';
import { ID_PATTERN } from './parse-client.constants';
import type { Parsed } from './parsed.type';
import type { RegistryClient } from './registry.type';

const parseClient = (value: unknown): Parsed<RegistryClient> => {
  if (!isRecord(value)) return { problem: 'client is not an object' };
  const { id, name, homepage, games, status, trust } = value;
  if (!isText(id) || !ID_PATTERN.test(id)) return { problem: 'client id is not a lowercase slug' };
  if (!isText(name) || !isText(homepage)) return { problem: `client ${id} needs a name and a homepage` };
  if (!isTextList(games)) return { problem: `client ${id} games is not a list of names` };
  if (status !== 'active' && status !== 'revoked') return { problem: `client ${id} status is not active or revoked` };
  const parsed = parseTrust(trust);
  if ('problem' in parsed) return { problem: `client ${id}: ${parsed.problem}` };
  return { value: { id, name, homepage, games, status, trust: parsed.value } };
};

export { parseClient };
