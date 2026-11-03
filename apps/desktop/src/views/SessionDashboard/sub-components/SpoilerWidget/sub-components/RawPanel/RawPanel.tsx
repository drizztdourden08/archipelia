/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useWidgetState } from '@drizztdourden08/brock-react';
import { LogLines } from '@archipelia/design';
import { textRows } from '../../../../behavior/text-rows';
import type { RawPanelProps } from './RawPanel.type';

const RawPanel = ({ text }: RawPanelProps) => {
  const [search, setSearch] = useWidgetState('search', '');
  const rows = useMemo(() => textRows(text), [text]);
  return <LogLines rows={rows} search={search} onSearchChange={setSearch} emptyLabel="The spoiler file is empty or missing." />;
};

export { RawPanel };
