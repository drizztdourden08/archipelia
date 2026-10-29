/* @layer renderer-app @kind logic */
import type { SessionPlayer, SessionTemplate } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { useLibraryStore } from '../stores/useLibraryStore';
import { newTemplate } from '../views/SessionBuilder/behavior/new-template';
import { REVIEW_LAYOUT, REVIEW_PORT } from './review.constants';
import type { LayoutSeed } from './seed-layout.type';

const heldPlayers = (names: readonly string[]): SessionPlayer[] => names.map((name, index) => ({ slot: index + 1, name, direct: true }));

const saveSeed = async ({ name, host, lan, players }: LayoutSeed, saved: readonly SessionTemplate[]): Promise<SessionTemplate> => {
  const base = newTemplate(saved.find((entry) => entry.name === name)?.id);
  const direct = players.length > 0 ? { direct: { admission: 'host-approval' as const, allowUnlisted: false } } : {};
  return appApi().templatesSave({ ...base, name, lan, host, ...direct, players: heldPlayers(players) });
};

const seedLayout = async (): Promise<SessionTemplate[]> => {
  const saved = await appApi().templatesList();
  const port = REVIEW_PORT + REVIEW_LAYOUT.portOffset;
  const seeds: LayoutSeed[] = [
    { name: REVIEW_LAYOUT.lan, host: { kind: 'local', port }, lan: true, players: REVIEW_LAYOUT.lanPlayers },
    { name: REVIEW_LAYOUT.remote, host: { kind: 'archipelago-gg' }, lan: false, players: [] },
    { name: REVIEW_LAYOUT.solo, host: { kind: 'local', port: port + 1 }, lan: false, players: REVIEW_LAYOUT.soloPlayers },
  ];
  const made: SessionTemplate[] = [];
  for (const seed of seeds) made.push(await saveSeed(seed, saved));
  await useLibraryStore.getState().loadTemplates();
  return made;
};

export { seedLayout };
