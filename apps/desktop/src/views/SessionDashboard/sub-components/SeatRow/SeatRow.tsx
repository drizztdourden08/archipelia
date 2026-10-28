/* @layer renderer-app @kind component */
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { Icon, Status } from '@drizztdourden08/tessera/primitives';
import { SEAT_STATES } from './SeatRow.constants';
import type { SeatRowProps } from './SeatRow.type';

const SeatRow = ({ seat }: SeatRowProps) => (
  <ListItemRow
    actionVisibility="always"
    role="listitem"
    icon={<Icon name="user" />}
    name={seat.name}
    meta={seat.game ? `${seat.game}, ${seat.meta}` : seat.meta}
    action={<Status map={SEAT_STATES} value={seat.state} />}
  />
);

export { SeatRow };
