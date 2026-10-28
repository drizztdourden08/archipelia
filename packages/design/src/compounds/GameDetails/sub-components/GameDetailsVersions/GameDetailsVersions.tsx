/* @layer renderer-app @kind component */
import { Field, Select } from '@drizztdourden08/tessera/primitives';
import { VERSION_FIELD, VERSION_TEXT } from '../../GameDetails.constants';
import { selectOptionOf } from './behavior/select-option-of';
import type { GameDetailsVersionsProps } from './GameDetailsVersions.type';
import { VersionRow } from '../VersionRow';

const GameDetailsVersions = ({ options, value, onChange, note, loading }: GameDetailsVersionsProps) => (
  <Field label={VERSION_TEXT.label} htmlFor={VERSION_FIELD} help={note}>
    <Select
      id={VERSION_FIELD}
      aria-label={VERSION_TEXT.label}
      options={options.map(selectOptionOf)}
      {...(value === undefined ? {} : { value })}
      onChange={onChange}
      renderOption={(option) => <VersionRow label={option.label} version={options.find((candidate) => candidate.value === option.value)} />}
      loading={loading ?? false}
      emptyText={VERSION_TEXT.none}
    />
  </Field>
);

export { GameDetailsVersions };
