/* @layer renderer-app @kind component */
import { Icon, Tag, Tooltip } from '@drizztdourden08/tessera/primitives';
import { DIRECT_HINT, DIRECT_LABEL } from '../../GameCard.constants';

const DirectTag = () => (
  <Tooltip content={DIRECT_HINT} placement="bottom">
    <Tag variant="urgency" color="info"><Icon name="plug-zap" size={12} />{DIRECT_LABEL}</Tag>
  </Tooltip>
);

export { DirectTag };
