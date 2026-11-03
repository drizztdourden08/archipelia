/* @layer renderer-app @kind component */
import { Button, EmptyState, Spinner, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { SESSION_FAILED } from '../../../../hooks/lobby-hooks.constants';
import { closeTab } from '../../../../live/close-tab';
import { RESULTS_TEXT } from '../../SessionTabs.constants';
import type { TemplateStateProps } from './TemplateState.type';

const TemplateState = ({ tab, saved }: TemplateStateProps) => {
  if (saved.failed) return <ErrorCallout message={SESSION_FAILED.template} onRetry={saved.retry} />;
  if (!saved.loaded) return <EmptyState icon={<Spinner />} message={SESSION_FAILED.loading} />;
  return (
    <Stack gap="md" align="center">
      <EmptyState message={SESSION_FAILED.gone} />
      <Button variant="secondary" onClick={() => void closeTab(tab.tabId)}>{RESULTS_TEXT.close}</Button>
    </Stack>
  );
};

export { TemplateState };
