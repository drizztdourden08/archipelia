/* @layer renderer-app @kind component */
import { Field, NumberInput, PasswordInput, RadioGroup, Stack, TextInput } from '@drizztdourden08/tessera/primitives';
import { PORT_RANGE } from '@archipelia/design';
import type { ServerFormProps } from './ServerForm.type';
import { AUTH_OPTIONS, KEY_PLACEHOLDER, SSH_PORT_RANGE } from './ServerForm.constants';
import { switchAuth } from '../../behavior/switch-auth';

const ServerForm = ({ entry, inputs, errors, onEntry, onInputs, onTouch }: ServerFormProps) => {
  const { auth } = entry;
  return (
    <Stack gap="sm">
      <Field label="Label" error={errors.label}>
        <TextInput value={entry.label} onBlur={() => onTouch('label')} onChange={(e) => onEntry({ ...entry, label: e.target.value })} />
      </Field>
      <Field label="Host" hint="Name or address of the machine." error={errors.host}>
        <TextInput value={entry.host} onBlur={() => onTouch('host')} onChange={(e) => onEntry({ ...entry, host: e.target.value })} />
      </Field>
      <Field label="SSH port" error={errors.port}>
        <NumberInput {...SSH_PORT_RANGE} value={entry.port} onBlur={() => onTouch('port')} onChange={(port) => onEntry({ ...entry, port })} />
      </Field>
      <Field label="User name" error={errors.username}>
        <TextInput value={auth.username} onBlur={() => onTouch('username')}
          onChange={(e) => onEntry({ ...entry, auth: { ...auth, username: e.target.value } })} />
      </Field>
      <RadioGroup label="Authentication" value={auth.kind} options={AUTH_OPTIONS} onChange={(kind) => onEntry(switchAuth(entry, kind))} />
      {auth.kind === 'ssh-key' && (
        <>
          <Field label="Key file" hint="Only the path is stored." error={errors.keyPath}>
            <TextInput value={auth.keyPath} placeholder={KEY_PLACEHOLDER} onBlur={() => onTouch('keyPath')}
              onChange={(e) => onEntry({ ...entry, auth: { ...auth, keyPath: e.target.value } })} />
          </Field>
          <Field label="Key passphrase" hint={auth.passphraseRef ? 'Stored in the vault. Type to replace it.' : 'Leave empty for a key without one.'}>
            <PasswordInput mode="new" value={inputs.passphrase} onChange={(passphrase) => onInputs({ ...inputs, passphrase })} />
          </Field>
        </>
      )}
      {auth.kind === 'ssh-password' && (
        <Field label="Password" hint={auth.passwordRef ? 'Stored in the vault. Type to replace it.' : 'Kept encrypted in the vault.'} error={errors.password}>
          <PasswordInput mode="new" value={inputs.password} onBlur={() => onTouch('password')} onChange={(password) => onInputs({ ...inputs, password })} />
        </Field>
      )}
      <Field label="Archipelago path on the host" hint="The source folder of Archipelago 0.6.7." error={errors.apPath}>
        <TextInput value={entry.apPath} onBlur={() => onTouch('apPath')} onChange={(e) => onEntry({ ...entry, apPath: e.target.value })} />
      </Field>
      <Field label="Game port" hint="Players connect here. Open it on the host's firewall." error={errors.gamePort}>
        <NumberInput min={PORT_RANGE.min} max={PORT_RANGE.max} value={entry.gamePort} onBlur={() => onTouch('gamePort')}
          onChange={(gamePort) => onEntry({ ...entry, gamePort })} />
      </Field>
    </Stack>
  );
};

export { ServerForm };
