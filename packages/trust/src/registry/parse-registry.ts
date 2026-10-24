/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { parseClient } from './parse-client';
import { parseGame } from './parse-game';
import { REGISTRY_FORMAT } from './registry.constants';
import type { RegistryParse } from './parse-registry.type';
import type { Parsed } from './parsed.type';
import type { RegistryClient, RegistryGame } from './registry.type';

const collect = <T,>(items: unknown[], parse: (item: unknown) => Parsed<T>, problems: string[]) =>
  items.flatMap((item) => {
    const parsed = parse(item);
    if ('problem' in parsed) {
      problems.push(parsed.problem);
      return [];
    }
    return [parsed.value];
  });

const duplicate = (ids: string[]) => ids.find((id, index) => ids.indexOf(id) !== index);

const parseRegistry = (value: unknown): RegistryParse => {
  if (!isRecord(value)) return { ok: false, problems: ['registry is not an object'] };
  if (value.format !== REGISTRY_FORMAT) return { ok: false, problems: [`registry format ${String(value.format)} is not ${REGISTRY_FORMAT}`] };
  if (!Array.isArray(value.clients) || !Array.isArray(value.games)) {
    return { ok: false, problems: ['registry needs a clients list and a games list'] };
  }
  const problems: string[] = [];
  const clients: RegistryClient[] = collect(value.clients, parseClient, problems);
  const repeated = duplicate(clients.map((client) => client.id));
  if (repeated !== undefined) return { ok: false, problems: [`client id ${repeated} is listed twice`] };
  const known = new Set(clients.map((client) => client.id));
  const games: RegistryGame[] = collect(value.games, parseGame, problems).filter((game) => {
    if (known.has(game.client)) return true;
    problems.push(`game ${game.game} names the unknown client ${game.client}`);
    return false;
  });
  return { ok: true, registry: { format: REGISTRY_FORMAT, clients, games }, problems };
};

export { parseRegistry };
