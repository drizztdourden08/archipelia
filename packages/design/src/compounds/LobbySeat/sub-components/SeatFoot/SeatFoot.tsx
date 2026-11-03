/* @layer renderer-app @kind component */
import { Flex, Tag } from '@drizztdourden08/tessera/primitives';
import { tagLookOf } from '../../behavior/tag-look-of';
import { SeatButtons } from '../SeatButtons';
import { SeatSide } from '../SeatSide';
import type { SeatFootProps } from './SeatFoot.type';

const SeatFoot = ({ side, status, actions }: SeatFootProps) => {
  if (!side && !status && actions.length === 0) return null;
  return (
    <Flex className="lobby-seat__foot" gap="sm" align="center" justify="between" wrap>
      {side && <SeatSide side={side} />}
      {status && <Tag {...tagLookOf(status.tone)} pill dot title={status.title}>{status.label}</Tag>}
      <SeatButtons className="lobby-seat__actions" actions={actions} />
    </Flex>
  );
};

export { SeatFoot };
