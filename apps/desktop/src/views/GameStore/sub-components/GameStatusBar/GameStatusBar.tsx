/* @layer renderer-app @kind component */
import { Box, Icon, IconButton, Tooltip } from '@drizztdourden08/tessera/primitives';
import { StatusBar } from '@drizztdourden08/tessera/composites';
import type { StatusBarEntry } from '@drizztdourden08/tessera/composites';
import type { GameStatusBarProps } from './GameStatusBar.type';

const itemsOf = ({ summary, filtered }: Pick<GameStatusBarProps, 'summary' | 'filtered'>): StatusBarEntry[] => [
  { id: 'worlds', label: 'Worlds', value: filtered ? `${summary.shown} of ${summary.worlds}` : summary.worlds, icon: 'gamepad-2' },
  { id: 'installed', label: 'Installed', value: summary.installed, icon: 'circle-check' },
  ...(summary.updates > 0 ? [{ id: 'updates', label: 'Updates', value: summary.updates, tone: 'warning' as const, icon: 'arrow-big-up-dash' as const, priority: 1 }] : []),
  ...(summary.apVersion ? [{ id: 'index', label: 'Index for AP', value: summary.apVersion, align: 'end' as const, priority: 2 }] : []),
];

const GameStatusBar = ({ summary, loading, filtered, adding, onAddFromFile }: GameStatusBarProps) => (
  <Box className="game-store__foot">
    <StatusBar className="game-store__foot-bar" label="Games status" items={loading && summary.worlds === 0 ? [] : itemsOf({ summary, filtered })} />
    <Box className="game-store__foot-action">
      <Tooltip content="Add a world from a file" placement="top">
        <IconButton size="sm" variant="ghost" label="Add from file" loading={adding} onClick={onAddFromFile}><Icon name="plus" /></IconButton>
      </Tooltip>
    </Box>
  </Box>
);

export { GameStatusBar };
