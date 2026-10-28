/* @layer renderer-app @kind component */
import { ListDetailLayout } from '@drizztdourden08/tessera/composites';
import type { PanelContainerConfig } from '@drizztdourden08/tessera/composites';
import { Button, EmptyState, Icon, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { useHistory } from './behavior/useHistory';
import { LIST_WIDTH, TEXT } from './History.constants';
import { HistoryDetail } from './sub-components/HistoryDetail';
import { HistoryFilters } from './sub-components/HistoryFilters';
import { RunsList } from './sub-components/RunsList';

const History = () => {
  const model = useHistory();
  const { shown, selected } = model;

  const containers: PanelContainerConfig[] = [
    {
      title: 'Filters',
      content: (
        <Stack gap="sm">
          <HistoryFilters filter={model.filter} sessions={model.options} />
          {model.loadError && <ErrorCallout message={model.loadError} onRetry={model.reload} />}
          {model.actionError && <ErrorCallout message={model.actionError} />}
        </Stack>
      ),
    },
    {
      title: 'Runs',
      sublabel: `${shown.length} of ${model.total}`,
      content: <RunsList runs={shown} total={model.total} loading={model.loading} selectedId={model.selectedId} onSelect={model.select} />,
    },
  ];

  const clean = (
    <Button size="sm" variant="secondary" icon={<Icon name="trash-2" />} disabled={model.staleCount === 0 || model.isBusy('clean')} onClick={model.clean}>Clean old runs</Button>
  );

  return (
    <ListDetailLayout
      listContainers={containers}
      detail={selected && (
        <HistoryDetail
          run={selected}
          templates={model.templates}
          busy={model.isBusy(selected.id)}
          actions={{ openRun: model.openRun, openSession: model.openSessionOf, deleteRun: model.deleteRun, runAgain: model.runAgain, showLog: model.showLog, openFiles: model.openFiles }}
        />
      )}
      emptyDetail={<EmptyState message={TEXT.noRun} />}
      listLabel="History"
      detailLabel="run"
      listAction={clean}
      storageKey="history.list"
      listWidth={LIST_WIDTH.initial}
      minListWidth={LIST_WIDTH.min}
      maxListWidth={LIST_WIDTH.max}
    />
  );
};

export { History };
