/* @layer renderer-app @kind component */
import { Box, Checkbox, Field, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { SOURCE_TEXT, WARNING_HELP, WARNING_LABEL } from '../../PackageSourceDialog.constants';
import type { TrustFieldsProps } from './TrustFields.type';

const TrustFields = ({ module, candidate, trusted, typed, onTrusted, onTyped }: TrustFieldsProps) => {
  const { id, warnings } = candidate;
  return (
    <Stack gap="md">
      <Text>{SOURCE_TEXT.trust(id, module)}</Text>
      {warnings.length > 0 && (
        <Stack gap="xs" as="ul" className="package-source__list" aria-label={SOURCE_TEXT.trustWarned}>
          {warnings.map((warning) => <Box as="li" key={warning}><Text tone="dim">{`${WARNING_LABEL[warning]}. ${WARNING_HELP[warning]}`}</Text></Box>)}
        </Stack>
      )}
      {warnings.length > 0
        ? <Field label={SOURCE_TEXT.trustType(id)} width="md"><TextInput value={typed} onChange={(event) => onTyped(event.target.value)} /></Field>
        : <Checkbox checked={trusted} onChange={onTrusted} label={SOURCE_TEXT.trustBox(id)} />}
    </Stack>
  );
};

export { TrustFields };
