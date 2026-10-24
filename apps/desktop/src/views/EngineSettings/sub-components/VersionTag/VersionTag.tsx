/* @layer renderer-app @kind component */
import { Tag } from '@drizztdourden08/tessera/primitives';
import { versionTagView } from '../../behavior/version-tag-view';
import { whenText } from '../../behavior/when-text';
import type { VersionTagProps } from './VersionTag.type';

const VersionTag = ({ tag, feed }: VersionTagProps) => {
  const view = versionTagView(tag, feed, whenText);
  return <Tag {...view.look} title={view.title}>{view.label}</Tag>;
};

export { VersionTag };
