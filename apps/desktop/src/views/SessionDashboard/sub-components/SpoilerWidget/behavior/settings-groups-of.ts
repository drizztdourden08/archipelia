/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { SpoilerLog, SpoilerSetting } from '@archipelia/sessions/spoiler';

const factsOf = (settings: readonly SpoilerSetting[]): FactsPanelFact[] => settings.map(({ key, value }) => ({ label: key, value: value || 'none' }));

const settingsGroupsOf = (log: SpoilerLog): { key: string; title: string; facts: FactsPanelFact[] }[] => [
  {
    key: 'world',
    title: 'Generation',
    facts: [{ label: 'Version', value: log.version }, { label: 'Seed', value: log.seed, mono: true, copyable: true }, ...factsOf(log.settings)],
  },
  ...log.players.map((player) => ({
    key: `player:${player.slot}`,
    title: `Slot ${player.slot}: ${player.name}`,
    facts: [{ label: 'Game', value: player.game }, ...factsOf(player.options)],
  })),
];

export { settingsGroupsOf };
