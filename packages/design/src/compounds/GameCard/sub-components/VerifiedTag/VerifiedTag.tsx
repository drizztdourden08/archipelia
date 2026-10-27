/* @layer renderer-app @kind component */
import { Icon, Tag, Tooltip } from '@drizztdourden08/tessera/primitives';
import { VERIFIED_HINT, VERIFIED_LABEL } from '../../GameCard.constants';

const VerifiedTag = () => (
  <Tooltip content={VERIFIED_HINT} placement="bottom">
    <Tag variant="urgency" color="success"><Icon name="circle-check" size={12} />{VERIFIED_LABEL}</Tag>
  </Tooltip>
);

export { VerifiedTag };
