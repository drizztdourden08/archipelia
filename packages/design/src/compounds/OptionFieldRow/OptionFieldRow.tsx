/* @layer renderer-app @kind component */
import type { OptionFieldRowProps } from './OptionFieldRow.type';
import { OptionField } from '../OptionField';
import { OptionControl } from '../OptionControl';

const OptionFieldRow = ({ def, value, hint, changed, problem, onChange, onReset }: OptionFieldRowProps) => (
  <OptionField
    label={def.displayName}
    description={def.description}
    hint={hint}
    changed={changed}
    advanced={def.visibility.length === 0}
    problem={problem}
    onReset={onReset}
  >
    <OptionControl def={def} value={value} onChange={onChange} />
  </OptionField>
);

export { OptionFieldRow };
