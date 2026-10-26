/* @layer renderer-app @kind component */
import { EmptyState, Spinner } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { SESSION_FAILED } from '../../hooks/lobby-hooks.constants';
import { useSavedTemplate } from '../../hooks/useSavedTemplate';
import type { SessionLobbyProps } from './SessionLobby.type';
import { LobbyScreen } from './sub-components/LobbyScreen';
import './SessionLobby.css';

const SessionLobby = ({ templateId }: SessionLobbyProps) => {
  const saved = useSavedTemplate(templateId);
  const { template } = saved;
  if (saved.failed) return <ErrorCallout message={SESSION_FAILED.template} onRetry={saved.retry} />;
  if (!template) return saved.loaded ? <EmptyState message={SESSION_FAILED.gone} /> : <EmptyState icon={<Spinner />} message={SESSION_FAILED.loading} />;
  return <LobbyScreen key={template.id} initial={template} />;
};

export { SessionLobby };
