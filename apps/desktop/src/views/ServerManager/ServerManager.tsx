/* @layer renderer-app @kind component */
import { SearchAnchor } from '@drizztdourden08/brock-react';
import { ListItemRow, MasterDetailLayout } from '@drizztdourden08/tessera/composites';
import { Box, Button, ButtonRow, Callout, EmptyState, Flex, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { NO_SERVER_TEXT } from './ServerManager.constants';
import { serverAnchor } from './behavior/server-anchor';
import { useServerManager } from './behavior/useServerManager';
import { ServerForm } from './sub-components/ServerForm';
import { ServerTestPanel } from './sub-components/ServerTestPanel';

const ServerManager = () => {
  const manager = useServerManager();
  const { draft } = manager;
  const list = (
    <Stack gap="sm">
      <Flex justify="between" align="center">
        <Text variant="subtitle">Servers · {manager.servers.length}</Text>
        <Button variant="primary" onClick={manager.create}>Add</Button>
      </Flex>
      {manager.servers.map((entry) => (
        <SearchAnchor key={entry.id} anchor={serverAnchor(entry.id)}>
          <ListItemRow actionVisibility="always" name={entry.label} selected={draft?.id === entry.id} onClick={() => manager.select(entry)}
            meta={`${entry.host} · ${entry.auth.kind === 'ssh-key' ? 'SSH key' : 'password'}`}
            action={entry.lastTest ? <Status tone={entry.lastTest.ok ? 'success' : 'danger'}>{entry.lastTest.ok ? 'tested' : 'failing'}</Status> : undefined} />
        </SearchAnchor>
      ))}
      <Text variant="caption">Passwords and key passphrases stay encrypted in the vault and are only used by the app itself.</Text>
    </Stack>
  );
  const detail = draft && (
    <Stack>
      <Flex justify="between" align="center" wrap>
        <Text as="h2" variant="subtitle">{draft.label || 'New server'}</Text>
        <ButtonRow>
          <Button variant="secondary" disabled={manager.busy || !draft.id} onClick={manager.runTest}>Test connection</Button>
          <Button variant="danger" disabled={manager.busy || !draft.id} onClick={manager.remove}>Remove</Button>
          <Button variant="primary" disabled={manager.busy} onClick={manager.save}>Save</Button>
        </ButtonRow>
      </Flex>
      {manager.error && <Box role="alert"><Callout tone="danger">{manager.error}</Callout></Box>}
      <ServerForm entry={draft} inputs={manager.inputs} errors={manager.errors} onEntry={manager.setDraft} onInputs={manager.setInputs} onTouch={manager.touch} />
      <ServerTestPanel test={manager.test} pinned={draft.hostKeySha256} busy={manager.busy} onTrust={manager.trust} />
    </Stack>
  );
  return (
    <MasterDetailLayout list={list} detailEmpty={!draft}
      detail={detail ?? <EmptyState message={NO_SERVER_TEXT} />} />
  );
};

export { ServerManager };
