/* @layer renderer-app @kind component */
import { Box, Callout, EmptyState } from '@drizztdourden08/tessera/primitives';
import { useRunLauncher } from '../../hooks/useRunLauncher';
import type { SessionBuilderProps } from './SessionBuilder.type';
import { useBuilderTemplate } from './behavior/useBuilderTemplate';
import { BuilderForm } from './sub-components/BuilderForm';
import './SessionBuilder.css';

const SessionBuilder = ({ templateId }: SessionBuilderProps) => {
  const { initial, missing, error } = useBuilderTemplate(templateId);
  const launcher = useRunLauncher();
  if (error) return <Box role="alert"><Callout tone="danger">{error}</Callout></Box>;
  if (missing) return <EmptyState message="This session no longer exists. Back to Sessions lists the saved ones." />;
  if (!initial) return <EmptyState message="Loading the session" />;
  return <BuilderForm key={initial.id} initial={initial} onRun={launcher.start} />;
};

export { SessionBuilder };
