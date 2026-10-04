/* @layer renderer-app @kind component */
import { EmptyState, Spinner } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { useRunLauncher } from '../../hooks/useRunLauncher';
import type { SessionBuilderProps } from './SessionBuilder.type';
import { useBuilderTemplate } from './behavior/useBuilderTemplate';
import { FAILURE } from './SessionBuilder.constants';
import { BuilderForm } from './sub-components/BuilderForm';
import './SessionBuilder.css';

const SessionBuilder = ({ templateId }: SessionBuilderProps) => {
  const { initial, missing, failed, retry } = useBuilderTemplate(templateId);
  const launcher = useRunLauncher();
  if (failed) return <ErrorCallout message={FAILURE.template} onRetry={retry} />;
  if (missing) return <EmptyState message="This session no longer exists. Back to Sessions lists the saved ones." />;
  if (!initial) return <EmptyState icon={<Spinner />} message="Loading the session" />;
  return <BuilderForm key={initial.id} initial={initial} onRun={launcher.start} />;
};

export { SessionBuilder };
