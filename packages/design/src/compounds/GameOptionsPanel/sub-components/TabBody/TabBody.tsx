/* @layer renderer-app @kind component */
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import { OptionGroup } from '@drizztdourden08/tessera/composites';
import type { LayoutRow } from '../../behavior/option-layout.type';
import type { TabBodyProps } from './TabBody.type';
import { ADVANCED_TITLE, NO_MATCH } from '../../GameOptionsPanel.constants';
import { GameOptionRow } from '../GameOptionRow';

const TabBody = ({ tab, readOnly, problems, onChange, onProblem }: TabBodyProps) => {
  const rowsOf = (rows: LayoutRow[]) => rows.map((row) => (
    <GameOptionRow key={row.key} row={row} readOnly={readOnly} problem={problems?.get(row.key)} onChange={onChange} onProblem={onProblem} />
  ));
  if (tab.basic.length + tab.advanced.length === 0) return <EmptyState message={NO_MATCH} />;
  return (
    <>
      {tab.basic.length > 0 && <OptionGroup title={tab.label}>{rowsOf(tab.basic)}</OptionGroup>}
      {tab.advanced.length > 0 && <OptionGroup title={ADVANCED_TITLE}>{rowsOf(tab.advanced)}</OptionGroup>}
    </>
  );
};

export { TabBody };
