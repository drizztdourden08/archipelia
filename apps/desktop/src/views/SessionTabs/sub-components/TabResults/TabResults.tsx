/* @layer renderer-app @kind component */
import { Button, ButtonRow, Callout, Icon, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { openHistory } from '../../../../hooks/open-history';
import { closeTab } from '../../../../live/close-tab';
import { RESULTS_TEXT } from '../../SessionTabs.constants';
import { useTabResults } from '../../behavior/useTabResults';
import type { TabResultsProps } from './TabResults.type';

const TabResults = ({ tab, run }: TabResultsProps) => {
  const model = useTabResults(run);
  return (
    <Stack gap="sm">
      <Callout tone="info">{RESULTS_TEXT.stopped}</Callout>
      {model.error && <ErrorCallout message={model.error} />}
      <ButtonRow>
        <Button variant="primary" icon={<Icon name="refresh-cw" />} disabled={model.busy} onClick={model.runAgain}>{RESULTS_TEXT.again}</Button>
        <Button variant="secondary" onClick={() => openHistory(tab.sessionId)}>{RESULTS_TEXT.history}</Button>
        <Button variant="secondary" onClick={() => void closeTab(tab.tabId)}>{RESULTS_TEXT.close}</Button>
      </ButtonRow>
    </Stack>
  );
};

export { TabResults };
