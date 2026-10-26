/* @layer renderer-app @kind component */
import { Box, Button, Checkbox, Field, Flex, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { useState } from 'react';
import { SOURCE_TEXT, WARNING_HELP, WARNING_LABEL } from '../../PackageSourceDialog.constants';
import type { TrustStepProps } from '../../PackageSourceDialog.type';

const TrustStep = ({ module, candidate, onTrust }: TrustStepProps) => {
  const [trusted, setTrusted] = useState(false);
  const [typed, setTyped] = useState('');
  const { id, warnings } = candidate;
  const warned = warnings.length > 0;
  const ready = warned ? typed.trim().toLowerCase() === id.toLowerCase() : trusted;
  return (
    <Stack gap="md">
      <Text>{SOURCE_TEXT.trust(id, module)}</Text>
      {warned && (
        <Stack gap="xs" as="ul" className="package-source__list" aria-label={SOURCE_TEXT.trustWarned}>
          {warnings.map((warning) => <Box as="li" key={warning}><Text tone="dim">{`${WARNING_LABEL[warning]}. ${WARNING_HELP[warning]}`}</Text></Box>)}
        </Stack>
      )}
      {warned
        ? (
          <Field label={SOURCE_TEXT.trustType(id)} width="md">
            <TextInput value={typed} onChange={(event) => setTyped(event.target.value)} onEnter={() => ready && onTrust()} />
          </Field>
        )
        : <Checkbox checked={trusted} onChange={setTrusted} label={SOURCE_TEXT.trustBox(id)} />}
      <Flex>
        <Button variant="primary" disabled={!ready} onClick={onTrust}>{SOURCE_TEXT.continue}</Button>
      </Flex>
    </Stack>
  );
};

export { TrustStep };
