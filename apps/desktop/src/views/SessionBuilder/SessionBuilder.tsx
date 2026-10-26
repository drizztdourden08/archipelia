/* @layer renderer-app @kind component */
import { useState } from 'react';
import { EmptyState, Spinner } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { SESSION_FAILED } from '../../hooks/lobby-hooks.constants';
import { useSavedTemplate } from '../../hooks/useSavedTemplate';
import type { SessionBuilderProps } from './SessionBuilder.type';
import { newTemplate } from './behavior/new-template';
import { useHostingDefaults } from './behavior/useHostingDefaults';
import { BuilderForm } from './sub-components/BuilderForm';

const SessionBuilder = ({ templateId }: SessionBuilderProps) => {
  const hosting = useHostingDefaults();
  const [fresh] = useState(() => (templateId === undefined ? newTemplate(undefined, hosting) : null));
  const saved = useSavedTemplate(templateId);
  const initial = fresh ?? saved.template;
  if (saved.failed) return <ErrorCallout message={SESSION_FAILED.template} onRetry={saved.retry} />;
  if (!initial) return saved.loaded ? <EmptyState message={SESSION_FAILED.gone} /> : <EmptyState icon={<Spinner />} message={SESSION_FAILED.loading} />;
  return <BuilderForm key={initial.id} initial={initial} />;
};

export { SessionBuilder };
