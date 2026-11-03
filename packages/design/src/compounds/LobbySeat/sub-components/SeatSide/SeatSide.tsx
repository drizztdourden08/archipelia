/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera/primitives';
import { SEAT_SIDES } from '../../LobbySeat.constants';
import type { SeatSideProps } from './SeatSide.type';

const SeatSide = ({ side }: SeatSideProps) => (
  <SegmentedControl
    size="sm"
    aria-label={side.label}
    value={side.value ?? ''}
    options={SEAT_SIDES.map(({ value, label }) => ({ value, label }))}
    disabled={side.locked || side.disabled}
    onChange={(value) => side.onChange?.(value === 'set' ? 'set' : 'direct')}
  />
);

export { SeatSide };
