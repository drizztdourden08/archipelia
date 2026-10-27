/* @layer renderer-app @kind component */
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import { Button, Icon } from '@drizztdourden08/tessera/primitives';
import { outputFacts } from '../../behavior/output-facts';
import { DetailSection } from '../DetailSection';
import type { OutputSectionProps } from './OutputSection.type';

const OutputSection = ({ run, onShowLog }: OutputSectionProps) => (
  <DetailSection
    title="Output"
    action={<Button size="sm" variant="secondary" icon={<Icon name="scroll-text" />} aria-label={`Show log of run ${run.snapshot.name}`} onClick={() => onShowLog(run)}>Show log</Button>}
  >
    <FactsPanel groups={[outputFacts(run)]} layout="rows" label="Output" />
  </DetailSection>
);

export { OutputSection };
