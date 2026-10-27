/* @layer renderer-app @kind component */
import { Button, EmptyState, Spinner, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { SESSION_FAILED } from '../../hooks/lobby-hooks.constants';
import { useSavedTemplate } from '../../hooks/useSavedTemplate';
import { closeTab } from '../../live/close-tab';
import { LOBBY_SCREEN } from './SessionLobby.constants';
import type { SessionLobbyProps } from './SessionLobby.type';
import { LobbyScreen } from './sub-components/LobbyScreen';
import './SessionLobby.css';

const SessionLobby = ({ tab }: SessionLobbyProps) => {
  const saved = useSavedTemplate(tab.sessionId);
  const { template } = saved;
  if (saved.failed) return <ErrorCallout message={SESSION_FAILED.template} onRetry={saved.retry} />;
  if (template) return <LobbyScreen key={tab.tabId} tab={tab} saved={template} />;
  if (!saved.loaded) return <EmptyState icon={<Spinner />} message={SESSION_FAILED.loading} />;
  return (
    <Stack gap="md" align="center">
      <EmptyState message={SESSION_FAILED.gone} />
      <Button variant="secondary" onClick={() => void closeTab(tab.tabId)}>{LOBBY_SCREEN.closeTab}</Button>
    </Stack>
  );
};

export { SessionLobby };
