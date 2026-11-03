/* @layer renderer-app @kind logic */
import { widgets } from '@drizztdourden08/brock-react';
import type { MenuGroup } from '@drizztdourden08/tessera/composites';
import { playerCommandGroups } from './player-command-groups';
import type { ConfirmCommand } from './player-command-groups.type';
import { CONSOLE_WIDGET, RUN_STAGE_TEXT } from './run-stage.constants';

const openConsole = () => widgets.open(CONSOLE_WIDGET);

const playerMenuGroups = (name: string, confirm: ConfirmCommand, disabled: boolean): MenuGroup[] => {
  const commands = playerCommandGroups([name], confirm, disabled)[0]?.items ?? [];
  const hint = { id: `hint-${name}`, label: `${RUN_STAGE_TEXT.hintFor} ${name}`, icon: 'sparkles', disabled, onSelect: openConsole };
  return [{ id: name, items: [...commands, hint] }];
};

export { playerMenuGroups };
