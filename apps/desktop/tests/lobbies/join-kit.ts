/* @layer tests @kind helper */
import { zipSync } from 'fflate';
import type { DataFiles, InstalledGame } from '@archipelia/model';
import type { JoinView } from '../../src/joins/joins.type';
import { buildJoinRecord } from '../../electron/joins/build-join-record';
import { clientInfo } from '../../electron/joins/client-info';
import { connectJoin } from '../../electron/joins/connect-join';
import { createJoinService } from '../../electron/joins/create-join-service';

const WORLD_PATH = 'custom_worlds/quest_world.apworld';

const text = new TextEncoder();

const questWorld = zipSync({
  'quest_world/__init__.py': text.encode('# quest world\n'),
  'quest_world/archipelago.json': text.encode(JSON.stringify({ game: 'Quest', world_version: '1.0.0' })),
});

const questGame = {
  apworld: 'quest_world', game: 'Quest', version: '1.0.0', source: 'file', installedAt: 0, sha256: 'x', verified: false, layout: 'apworld', path: WORLD_PATH, requires: [],
  schema: { game: 'Quest', worldVersion: '1.0.0', groups: [], presets: {}, options: [] },
} satisfies InstalledGame;

const joinRecord = (address: string, code: string) => buildJoinRecord(
  { address, code, displayName: 'Cy', slotName: 'Cy', game: 'Quest', source: { kind: 'preset', presetId: '' } },
  { installed: () => Promise.resolve([questGame]), presets: { get: () => Promise.resolve(null) }, worldPath: () => Promise.resolve(WORLD_PATH), readWorld: () => Promise.resolve(questWorld), now: 1 },
);

const startJoins = (files: DataFiles, ap: string) => {
  const views: JoinView[] = [];
  const watchers: { match: (view: JoinView) => boolean; done: (view: JoinView) => void }[] = [];
  const service = createJoinService({
    files, connect: connectJoin, readWorld: () => Promise.resolve(questWorld), client: clientInfo('Archipelia', '0.1.0'), engineAp: () => Promise.resolve(ap),
    emit: (view) => {
      views.push(view);
      for (const watcher of watchers.filter((entry) => entry.match(view))) watcher.done(view);
    },
  });
  const until = (match: (view: JoinView) => boolean) => new Promise<JoinView>((done) => {
    const seen = views.find(match);
    if (seen) done(seen);
    else watchers.push({ match, done });
  });
  return { service, views, until };
};

export { joinRecord, questWorld, startJoins };
