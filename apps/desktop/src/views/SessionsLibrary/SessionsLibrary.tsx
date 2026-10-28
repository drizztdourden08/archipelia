/* @layer renderer-app @kind component */
import { nav } from '@drizztdourden08/brock-react';
import { Button, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { ROUTE } from '../../hooks/app-navigation.constants';
import { TOUR_TARGET } from '../../hooks/tour-targets.constants';
import { useSessionsLibrary } from './behavior/useSessionsLibrary';
import { SessionsCard } from './sub-components/SessionsCard';
import { TemplateSearchEntry } from './sub-components/TemplateSearchEntry';

const SessionsLibrary = () => {
  const hub = useSessionsLibrary();

  return (
    <Stack>
      <Flex justify="between" align="center" gap="sm" wrap>
        <Text variant="caption">A session is a saved setup. Start opens it as a tab in the main window, where you add players and run it. Each run makes a seed and a room, kept in History with its files.</Text>
        <Button size="sm" variant="secondary" icon={<Icon name="log-in" />} data-tour={TOUR_TARGET.sessionsJoin} onClick={() => nav.open(ROUTE.joinSession)}>Join a session</Button>
      </Flex>
      {hub.loadError && <ErrorCallout message={hub.loadError} onRetry={hub.reload} />}
      {hub.actionError && <ErrorCallout message={hub.actionError} />}
      {hub.templates.map((template) => <TemplateSearchEntry key={template.id} template={template} servers={hub.servers} />)}
      {!hub.loadError && (
        <SessionsCard
          templates={hub.visibleTemplates}
          total={hub.templates.length}
          loading={hub.loading}
          servers={hub.servers}
          runCounts={hub.runCounts}
          isBusy={hub.isBusy}
          onEdit={hub.edit}
          onStart={hub.start}
          onHistory={hub.history}
          onDuplicate={hub.duplicate}
          onDelete={hub.deleteTemplate}
        />
      )}
    </Stack>
  );
};

export { SessionsLibrary };
