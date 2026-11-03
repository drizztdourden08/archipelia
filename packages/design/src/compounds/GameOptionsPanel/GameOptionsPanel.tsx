/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { OptionsPanel } from '@drizztdourden08/tessera/composites';
import type { GameOptionsPanelProps } from './GameOptionsPanel.type';
import { optionLayoutOf } from './behavior/option-layout';
import { useFocusOption } from './behavior/useFocusOption';
import { useOptionsView } from './behavior/useOptionsView';
import { OptionsToolbar } from './sub-components/OptionsToolbar';
import { TabBody } from './sub-components/TabBody';
import './GameOptionsPanel.css';

const GameOptionsPanel = (props: GameOptionsPanelProps) => {
  const { schema, values, onChange, readOnly = false, title, problems, onProblem, focusKey, onFocused, toolbar, className } = props;
  const view = useOptionsView();
  const layout = useMemo(() => optionLayoutOf(schema, values, view.query), [schema, values, view.query]);
  const active = layout.tabs.find((tab) => tab.id === view.tab) ?? layout.tabs[0];
  const tabs = useMemo(
    () => layout.tabs.map((tab) => ({ id: tab.id, label: tab.label, badge: tab.changed, badgeTone: 'warn' as const })),
    [layout.tabs],
  );
  const editable = !readOnly && onChange !== undefined;
  const resetAll = useCallback(() => layout.changedRows.forEach((row) => onChange?.(row.key, row.defaultValue)), [layout.changedRows, onChange]);
  useFocusOption({ focusKey, schema, query: view.query, tab: active.id, setTab: view.setTab, setQuery: view.setQuery, onFocused });

  return (
    <OptionsPanel
      title={title ?? schema.game}
      tabs={tabs}
      activeTab={active.id}
      onTabChange={view.setTab}
      className={className}
      toolbar={(
        <OptionsToolbar
          query={view.query}
          onQueryChange={view.setQuery}
          onResetAll={editable && layout.changedRows.length > 0 ? resetAll : undefined}
          extra={toolbar}
        />
      )}
    >
      <TabBody tab={active} readOnly={!editable} problems={problems} onChange={onChange} onProblem={onProblem} />
    </OptionsPanel>
  );
};

export { GameOptionsPanel };
