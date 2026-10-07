/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera/composites';
import type { ConfirmCommand } from './player-command-groups.type';

const playerCommandGroups = (names: readonly string[], confirm: ConfirmCommand, disabled: boolean): MenuGroup[] =>
  names.map((name) => ({
    id: name,
    label: name,
    items: [
      {
        id: `release-${name}`,
        label: `Release ${name}`,
        icon: 'send',
        disabled,
        onSelect: () => confirm(`/release ${name}`, `Release ${name}`, `Every item still in ${name}'s world is sent to its owner.`),
      },
      {
        id: `collect-${name}`,
        label: `Collect for ${name}`,
        icon: 'download',
        disabled,
        onSelect: () => confirm(`/collect ${name}`, `Collect for ${name}`, `Every item of ${name} still in other worlds is sent to ${name}.`),
      },
    ],
  }));

export { playerCommandGroups };
