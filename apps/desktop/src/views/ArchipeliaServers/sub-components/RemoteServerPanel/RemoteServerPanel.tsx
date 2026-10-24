/* @layer renderer-app @kind component */
import { useState } from 'react';
import { ActionBar, CopyValue, FactsPanel, PasswordInput } from '@drizztdourden08/tessera/composites';
import type { ActionItem } from '@drizztdourden08/tessera/composites';
import { Button, Callout, Field, Inline, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { formatPin } from '../../../../lobbies/format-pin';
import { entryStatus } from '../../behavior/entry-status';
import { remoteFacts } from '../../behavior/remote-facts';
import type { RemotePanelProps } from '../../ArchipeliaServers.type';
import { PanelHeading } from '../PanelHeading';

const RemoteServerPanel = ({ entry, model, test }: RemotePanelProps) => {
  const [token, setToken] = useState<string | null>(null);
  const status = entryStatus(entry);
  const busy = model.isBusy();
  const actions: ActionItem[] = [
    { id: 'replace', label: 'Replace token', icon: 'lock', onSelect: () => setToken(''), disabled: busy },
    {
      id: 'remove', label: 'Remove', icon: 'trash-2', kind: 'danger', onSelect: () => void model.remove(entry.id), disabled: busy,
      confirm: { title: `Remove ${entry.label}?`, confirmLabel: 'Remove server' },
    },
    { id: 'test', label: 'Test connection', icon: 'refresh-cw', kind: 'primary', onSelect: () => void model.retest(entry.id), disabled: busy },
  ];
  const trust = test?.certSha256 ? <Button size="sm" variant="primary" disabled={busy} onClick={() => void model.trust(entry, test.certSha256 ?? '')}>Trust this certificate</Button> : null;
  return (
    <Stack>
      <PanelHeading
        title={entry.label}
        status={<Status tone={status.tone} dot>{status.text}</Status>}
        actions={<ActionBar label={`${entry.label} actions`} actions={actions} align="end" />}
      />
      {test && !test.ok && !test.certSha256 && <Callout tone="danger">{test.message}</Callout>}
      {test?.certSha256 && (
        <Callout tone="warning" action={trust}>
          <Stack gap="xs">
            <Text>{test.message}</Text>
            <CopyValue value={formatPin(test.certSha256)} label="certificate fingerprint" mono />
          </Stack>
        </Callout>
      )}
      <FactsPanel label={`${entry.label} details`} groups={[remoteFacts(entry, test)]} layout="boxed" />
      {token !== null && (
        <Field label="New admin token" hint="Stored in the vault. The old token is replaced.">
          <Inline gap="sm">
            <PasswordInput mode="new" value={token} onChange={setToken} />
            <Button variant="primary" disabled={busy || !token} onClick={() => { void model.replaceToken(entry, token); setToken(null); }}>Save token</Button>
            <Button variant="secondary" onClick={() => setToken(null)}>Cancel</Button>
          </Inline>
        </Field>
      )}
    </Stack>
  );
};

export { RemoteServerPanel };
