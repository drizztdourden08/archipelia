/* @layer tests @kind test */
import type { AdminLobby, AdminLobbyMember, AdminWorld, SlotUpload } from '@archipelia/model';

const slot = (patch: Partial<SlotUpload> = {}): SlotUpload => ({ name: 'Zelda', game: 'Unlisted Quest', yamlSha256: 'y1', yamlSize: 10, state: 'ok', ...patch });

const member = (patch: Partial<AdminLobbyMember> = {}): AdminLobbyMember => ({
  id: 'm_1', kind: 'client', displayName: 'Zelda', admission: 'pending', trust: 'unlisted', ready: false, slots: [slot()], joinedAt: 1, lastSeenAt: 1,
  client: { id: 'quest-client', name: 'Quest Client', version: '1.4.2', archipelago: '0.6.8', platform: { os: 'linux', arch: 'x64' }, capabilities: [] },
  ...patch,
});

const world = (patch: Partial<AdminWorld> = {}): AdminWorld => ({
  sha256: 'w1', size: 2048, game: 'Unlisted Quest', module: 'unlisted_quest', worldVersion: '1.0.0', memberId: 'm_1', proofSent: false,
  trust: { level: 'unlisted', detail: 'No proof was sent.', checkedAt: 1 }, ...patch,
});

const lobby = (patch: Partial<AdminLobby> = {}): AdminLobby => ({
  id: 'lb_1', code: 'K7QM4XT2', name: 'Friday seed', phase: 'open', rev: 1, engine: { id: 'e', ap: '0.6.7', python: '3.12.0' },
  options: {
    admission: 'host-approval', allowUnlisted: true, maxSlots: 16, limits: { worldBytes: 1, yamlBytes: 1, memberBytes: 1 }, room: { kind: 'local', port: 38281 },
    generator: { spoiler: 1, race: false, progressionBalancing: true }, server: { hintCost: 10, releaseMode: 'goal', collectMode: 'goal', remainingMode: 'goal', autoShutdownMinutes: 0 },
  },
  members: [member()], worlds: [world()], nextMember: 2, createdAt: 10, closesAt: 20, ...patch,
});

export { lobby, member, slot };
