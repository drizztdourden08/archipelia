/* @layer renderer-app @kind component */
import { ListItemRow, MasterDetailLayout } from '@drizztdourden08/tessera/composites';
import { Badge, Button, ButtonRow, EmptyState, Flex, Stack, Text } from '@drizztdourden08/tessera/primitives';
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
        <ListItemRow key={entry.id} name={entry.label} selected={draft?.id === entry.id} onClick={() => manager.select(entry)}
          meta={`${entry.host} · ${entry.auth.kind === 'ssh-key' ? 'SSH key' : 'password'}`}
          action={entry.lastTest ? <Badge variant={entry.lastTest.ok ? 'success' : 'danger'}>{entry.lastTest.ok ? 'tested' : 'failing'}</Badge> : undefined} />
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
          <Button variant="secondary" disabled={manager.busy || !draft.id} onClick={manager.remove}>Remove</Button>
          <Button variant="primary" disabled={manager.busy || manager.problems.length > 0} onClick={manager.save}>Save</Button>
        </ButtonRow>
      </Flex>
      {manager.problems.map((problem) => <Text key={problem} variant="caption">{problem}</Text>)}
      {manager.error && <Text variant="body" role="alert">{manager.error}</Text>}
      <ServerForm entry={draft} inputs={manager.inputs} onEntry={manager.setDraft} onInputs={manager.setInputs} />
      <ServerTestPanel test={manager.test} pinned={draft.hostKeySha256} busy={manager.busy} onTrust={manager.trust} />
    </Stack>
  );
  return (
    <MasterDetailLayout list={list} detailEmpty={!draft}
      detail={detail ?? <EmptyState message="Pick a server, or add one to host sessions on your own machine." />} />
  );
};

export { ServerManager };
