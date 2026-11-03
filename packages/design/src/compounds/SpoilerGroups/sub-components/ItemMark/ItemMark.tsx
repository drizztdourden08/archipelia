/* @layer renderer-app @kind component */
import { Icon } from '@drizztdourden08/tessera/primitives';
import { MARK_ICON } from '../../SpoilerGroups.constants';
import type { ItemMarkProps } from './ItemMark.type';

const ItemMark = ({ tone, label }: ItemMarkProps) => (
  <Icon name={MARK_ICON[tone]} size={12} className={`spoiler-row__mark spoiler-row__mark--${tone}`} role="img" aria-label={label} />
);

export { ItemMark };
