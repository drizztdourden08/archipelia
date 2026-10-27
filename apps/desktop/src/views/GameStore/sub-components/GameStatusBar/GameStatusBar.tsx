/* @layer renderer-app @kind component */
import { StatusBar } from '@drizztdourden08/tessera/composites';
import type { StatusBarAction, StatusBarEntry } from '@drizztdourden08/tessera/composites';
import type { GameStatusBarProps } from './GameStatusBar.type';

const itemsOf = ({ summary, filtered }: Pick<GameStatusBarProps, 'summary' | 'filtered'>): StatusBarEntry[] => [
  { id: 'worlds', label: 'All worlds', value: filtered ? `${summary.shown} of ${summary.worlds}` : summary.worlds, icon: 'gamepad-2' },
  { id: 'installed', label: 'Installed', value: summary.installed, icon: 'circle-check' },
  ...(summary.updates > 0 ? [{ id: 'updates', label: 'Updates', value: summary.updates, tone: 'warning' as const, icon: 'arrow-big-up-dash' as const, priority: 1 }] : []),
  ...(summary.noRelease > 0 ? [{ id: 'no-release', label: 'No release yet', value: summary.noRelease, icon: 'clock' as const, priority: 3 }] : []),
  ...(summary.apVersion ? [{ id: 'index', label: 'Archipelago index for AP', value: summary.apVersion, align: 'end' as const, priority: 2 }] : []),
];

const actionsOf = ({ adding, onAddFromFile }: Pick<GameStatusBarProps, 'adding' | 'onAddFromFile'>): StatusBarAction[] => [
  { id: 'add-from-file', label: 'Add from file', icon: 'plus', loading: adding, onSelect: onAddFromFile },
];

const GameStatusBar = ({ summary, loading, filtered, adding, onAddFromFile }: GameStatusBarProps) => (
  <StatusBar label="Games status" items={loading && summary.worlds === 0 ? [] : itemsOf({ summary, filtered })} actions={actionsOf({ adding, onAddFromFile })} />
);

export { GameStatusBar };
