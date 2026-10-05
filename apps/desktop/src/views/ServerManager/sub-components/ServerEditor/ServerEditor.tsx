/* @layer renderer-app @kind component */
import { SaveBar } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Flex, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import type { ServerEditorProps } from './ServerEditor.type';
import { rowName } from '../../behavior/row-name';
import { ServerForm } from '../ServerForm';
import { ServerTestPanel } from '../ServerTestPanel';

const ServerEditor = ({ draft, manager }: ServerEditorProps) => (
  <Stack>
    <Flex justify="between" align="center" wrap>
      <Text as="h2" variant="subtitle">{rowName(draft)}</Text>
      <ButtonRow>
        <Button variant="secondary" disabled={manager.busy || !draft.id} onClick={manager.runTest}>Test connection</Button>
        <Button variant="danger" disabled={manager.busy || !draft.id} onClick={manager.remove}>Remove</Button>
      </ButtonRow>
    </Flex>
    {manager.error && <ErrorCallout message={manager.error} />}
    <ServerForm entry={draft} inputs={manager.inputs} errors={manager.errors} onEntry={manager.setDraft} onInputs={manager.setInputs} onTouch={manager.touch} />
    <ServerTestPanel test={manager.test} pinned={draft.hostKeySha256} busy={manager.busy} onTrust={manager.trust} />
    <SaveBar state={manager.saveBar.state} error={manager.saveBar.error} onSave={() => void manager.save()} onDiscard={manager.discard} />
  </Stack>
);

export { ServerEditor };
