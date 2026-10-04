/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import type { GenerationFieldsProps } from './GenerationFields.type';
import { generationRows } from '../../behavior/generation-rows';

const GenerationFields = ({ generator, onGenerator }: GenerationFieldsProps) => {
  const rows = useMemo(() => generationRows(generator, onGenerator), [generator, onGenerator]);
  return <SettingsSection id="generation" title="Generation" description="How the seed is made." rows={rows} />;
};

export { GenerationFields };
