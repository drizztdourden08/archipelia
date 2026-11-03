/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera/composites';
import { RUN_STAGE_TEXT } from '../../behavior/run-stage.constants';
import type { PlayerMenuProps } from './PlayerMenu.type';

const PlayerMenu = ({ name, groups }: PlayerMenuProps) => (
  <DropdownMenu trigger={{ label: `${RUN_STAGE_TEXT.commandsFor} ${name}`, icon: 'ellipsis', iconOnly: true }} variant="ghost" size="sm" groups={groups} />
);

export { PlayerMenu };
