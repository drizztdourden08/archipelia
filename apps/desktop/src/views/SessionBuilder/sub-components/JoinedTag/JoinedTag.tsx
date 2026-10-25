/* @layer renderer-app @kind component */
import { Icon, Inline, Tag } from '@drizztdourden08/tessera/primitives';
import { PLAYERS_TEXT } from '../../SessionBuilder.constants';

const JoinedTag = () => (
  <Tag color="secondary" title={PLAYERS_TEXT.addedTitle}>
    <Inline gap="xs" align="center"><Icon name="pencil" />{PLAYERS_TEXT.added}</Inline>
  </Tag>
);

export { JoinedTag };
