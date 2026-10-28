/* @layer renderer-app @kind component */
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import { Button, Flex, Icon } from '@drizztdourden08/tessera/primitives';
import { outputFacts } from '../../behavior/output-facts';
import { DetailSection } from '../DetailSection';
import type { OutputSectionProps } from './OutputSection.type';

const OutputSection = ({ run, onShowLog, onOpenFiles }: OutputSectionProps) => (
  <DetailSection
    title="Output"
    action={(
      <Flex gap="xs">
        <Button size="sm" variant="secondary" icon={<Icon name="folder-open" />} disabled={!run.output} aria-label={`Open the output files of run ${run.snapshot.name}`} onClick={() => onOpenFiles(run)}>Open files</Button>
        <Button size="sm" variant="secondary" icon={<Icon name="scroll-text" />} aria-label={`Show log of run ${run.snapshot.name}`} onClick={() => onShowLog(run)}>Show log</Button>
      </Flex>
    )}
  >
    <FactsPanel groups={[outputFacts(run)]} layout="rows" label="Output" />
  </DetailSection>
);

export { OutputSection };
