/* @layer renderer-app @kind component */
import { ContentHeader, FactsPanel } from '@drizztdourden08/tessera/composites';
import { Stack, Status } from '@drizztdourden08/tessera/primitives';
import { configFacts } from '../../behavior/config-facts';
import { playerRows } from '../../behavior/player-rows';
import { runChip } from '../../behavior/run-chip';
import { sourceLinkOf } from '../../behavior/source-link';
import { statusOf } from '../../behavior/run-status';
import { DATE_FORMAT } from '../../History.constants';
import { DetailSection } from '../DetailSection';
import { OutputSection } from '../OutputSection';
import { OverridesSection } from '../OverridesSection';
import { PlayersSection } from '../PlayersSection';
import { RunActions } from '../RunActions';
import { SourceSection } from '../SourceSection';
import type { HistoryDetailProps } from './HistoryDetail.type';

const HistoryDetail = ({ run, templates, busy, actions }: HistoryDetailProps) => {
  const status = statusOf(run);
  const link = sourceLinkOf(run, templates);
  return (
    <Stack gap="md">
      <ContentHeader title={`Run of ${DATE_FORMAT.format(run.createdAt)}`} compact strip={<Status tone={status.tone}>{status.label}</Status>} />
      <RunActions run={run} sessionId={link.sessionId} busy={busy} onOpenRun={actions.openRun} onOpenSession={actions.openSession} onRunAgain={actions.runAgain} onDelete={actions.deleteRun} />
      <SourceSection link={link} chip={runChip(run)} onOpen={actions.openSession} />
      <OverridesSection overrides={run.source?.overrides ?? []} />
      <PlayersSection rows={playerRows(run)} />
      <DetailSection title="Config">
        <FactsPanel groups={configFacts(run.snapshot)} layout="rows" label="Config" />
      </DetailSection>
      <OutputSection run={run} onShowLog={actions.showLog} />
    </Stack>
  );
};

export { HistoryDetail };
