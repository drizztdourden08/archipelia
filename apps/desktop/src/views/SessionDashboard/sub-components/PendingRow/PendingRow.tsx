/* @layer renderer-app @kind component */
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { Icon, Status } from '@drizztdourden08/tessera/primitives';
import { WAITING_TEXT } from './PendingRow.constants';
import type { PendingRowProps } from './PendingRow.type';

const PendingRow = ({ join }: PendingRowProps) => (
  <ListItemRow
    actionVisibility="always"
    role="listitem"
    icon={<Icon name="wifi" />}
    name={join.name}
    meta={join.client}
    action={<Status tone="warning">{WAITING_TEXT}</Status>}
  />
);

export { PendingRow };
