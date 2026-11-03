/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { SpoilerLog, SpoilerSetting } from '@archipelia/sessions/spoiler';

type SettingsGroup = { key: string; title: string; facts: FactsPanelFact[] };

const factsOf = (settings: readonly SpoilerSetting[]): FactsPanelFact[] => settings.map(({ key, value }) => ({ label: key, value: value || 'none' }));

const settingsGroupsOf = (log: SpoilerLog): SettingsGroup[] => [
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
export type { SettingsGroup };
