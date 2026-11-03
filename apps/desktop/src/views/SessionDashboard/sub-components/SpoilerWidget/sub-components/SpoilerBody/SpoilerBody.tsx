/* @layer renderer-app @kind component */
import { SpoilerGroups } from '@archipelia/design';
import { EMPTY_LABEL } from '../../SpoilerWidget.constants';
import { RawPanel } from '../RawPanel';
import { SettingsPanel } from '../SettingsPanel';
import type { SpoilerBodyProps } from './SpoilerBody.type';

const SpoilerBody = ({ log, text, root, state }: SpoilerBodyProps) => {
  const { tab, view, expanded, setExpanded } = state;
  if (tab === 'settings') return <SettingsPanel log={log} />;
  if (tab === 'raw') return <RawPanel text={text} />;
  if (!root) return null;
  return (
    <SpoilerGroups
      root={root}
      view={view}
      expanded={expanded}
      onExpandedChange={setExpanded}
      label={tab}
      emptyLabel={EMPTY_LABEL[tab]}
    />
  );
};

export { SpoilerBody };
