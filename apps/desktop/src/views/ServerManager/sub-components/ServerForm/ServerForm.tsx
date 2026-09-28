/* @layer renderer-app @kind component */
import { Field, NumberInput, RadioGroup, Stack, TextInput } from '@drizztdourden08/tessera/primitives';
import type { ServerFormProps } from './ServerForm.type';
import { AUTH_OPTIONS, KEY_PLACEHOLDER } from './ServerForm.constants';
import { switchAuth } from '../../behavior/switch-auth';

const ServerForm = ({ entry, inputs, onEntry, onInputs }: ServerFormProps) => {
  const { auth } = entry;
  return (
    <Stack gap="sm">
      <Field label="Label"><TextInput value={entry.label} onChange={(e) => onEntry({ ...entry, label: e.target.value })} /></Field>
      <Field label="Host" hint="Name or address of the machine.">
        <TextInput value={entry.host} onChange={(e) => onEntry({ ...entry, host: e.target.value })} />
      </Field>
      <Field label="SSH port"><NumberInput min={1} max={65535} value={entry.port} onChange={(port) => onEntry({ ...entry, port })} /></Field>
      <Field label="User name">
        <TextInput value={auth.username} onChange={(e) => onEntry({ ...entry, auth: { ...auth, username: e.target.value } })} />
      </Field>
      <RadioGroup label="Authentication" value={auth.kind} options={AUTH_OPTIONS} onChange={(kind) => onEntry(switchAuth(entry, kind))} />
      {auth.kind === 'ssh-key' && (
        <>
          <Field label="Key file" hint="Only the path is stored.">
            <TextInput value={auth.keyPath} placeholder={KEY_PLACEHOLDER} onChange={(e) => onEntry({ ...entry, auth: { ...auth, keyPath: e.target.value } })} />
          </Field>
          <Field label="Key passphrase" hint={auth.passphraseRef ? 'Stored in the vault. Type to replace it.' : 'Leave empty for a key without one.'}>
            <TextInput type="password" value={inputs.passphrase} onChange={(e) => onInputs({ ...inputs, passphrase: e.target.value })} />
          </Field>
        </>
      )}
      {auth.kind === 'ssh-password' && (
        <Field label="Password" hint={auth.passwordRef ? 'Stored in the vault. Type to replace it.' : 'Kept encrypted in the vault.'}>
          <TextInput type="password" value={inputs.password} onChange={(e) => onInputs({ ...inputs, password: e.target.value })} />
        </Field>
      )}
      <Field label="Archipelago path on the host" hint="The source folder of Archipelago 0.6.7.">
        <TextInput value={entry.apPath} onChange={(e) => onEntry({ ...entry, apPath: e.target.value })} />
      </Field>
      <Field label="Game port" hint="Players connect here. Open it on the host's firewall.">
        <NumberInput min={1} max={65535} value={entry.gamePort} onChange={(gamePort) => onEntry({ ...entry, gamePort })} />
      </Field>
    </Stack>
  );
};

export { ServerForm };
