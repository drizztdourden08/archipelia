/* @layer renderer-app @kind component */
import { nav } from '@drizztdourden08/brock-react';
import { ListDetailLayout } from '@drizztdourden08/tessera/composites';
import type { PanelContainerConfig } from '@drizztdourden08/tessera/composites';
import { Button, EmptyState, Icon, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { ROUTE } from '../../hooks/app-navigation.constants';
import { TOUR_TARGET } from '../../hooks/tour-targets.constants';
import { SessionBuilder } from '../SessionBuilder';
import { useSessions } from './behavior/useSessions';
import { LIST_WIDTH, TEXT } from './Sessions.constants';
import { SessionsList } from './sub-components/SessionsList';
import { TemplateSearchEntry } from './sub-components/TemplateSearchEntry';

const Sessions = () => {
  const model = useSessions();
  const { selectedId } = model;

  const containers: PanelContainerConfig[] = [
    {
      title: 'Sessions',
      sublabel: String(model.templates.length),
      content: (
        <Stack gap="sm">
          {model.loadError && <ErrorCallout message={model.loadError} onRetry={model.reload} />}
          {model.actionError && <ErrorCallout message={model.actionError} />}
          {model.templates.map((template) => <TemplateSearchEntry key={template.id} template={template} servers={model.servers} />)}
          <SessionsList
            templates={model.templates}
            servers={model.servers}
            stats={model.runStats}
            selectedId={selectedId}
            loading={model.loading}
            isBusy={model.isBusy}
            onSelect={model.select}
            onDuplicate={model.duplicate}
            onDelete={model.deleteTemplate}
          />
        </Stack>
      ),
    },
  ];

  const join = (
    <Button size="sm" variant="secondary" icon={<Icon name="log-in" />} data-tour={TOUR_TARGET.sessionsJoin} onClick={() => nav.open(ROUTE.joinSession)}>{TEXT.join}</Button>
  );

  return (
    <ListDetailLayout
      listContainers={containers}
      detail={selectedId && <SessionBuilder key={selectedId} templateId={selectedId} onDirty={model.setDirty} />}
      emptyDetail={<EmptyState message={TEXT.pick} />}
      listLabel="Sessions"
      detailLabel="session"
      listAction={join}
      storageKey="sessions.list"
      listWidth={LIST_WIDTH.initial}
      minListWidth={LIST_WIDTH.min}
      maxListWidth={LIST_WIDTH.max}
    />
  );
};

export { Sessions };
