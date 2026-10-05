/* @layer renderer-app @kind component */
import { FormRow } from '@drizztdourden08/tessera/composites';
import type { OptionFieldRowProps } from './OptionFieldRow.type';
import { OptionControl } from '../OptionControl';
import { OptionAbout } from './sub-components/OptionAbout';
import './OptionFieldRow.css';

const OptionFieldRow = ({ def, value, hint, changed, problem, onChange, onReset, onProblem }: OptionFieldRowProps) => (
  <FormRow
    label={def.displayName}
    description={def.description.trim() || hint ? <OptionAbout label={def.displayName} description={def.description} hint={hint} /> : undefined}
    changed={changed}
    advanced={def.visibility.length === 0}
    problem={problem}
    onReset={onReset}
  >
    <OptionControl def={def} value={value} onChange={onChange} onProblem={onProblem} />
  </FormRow>
);

export { OptionFieldRow };
