/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Field, NumberInput, Select, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { HostFieldsProps } from './HostFields.type';
import type { HostKind } from '../../ServerOptionsForm.type';
import { HOST_OPTIONS } from '../../ServerOptionsForm.constants';

const HostFields = ({ host, serverOptions, onHostKind, onPort, onRemoteServer }: HostFieldsProps) => {
  const setKind = useCallback((value: string) => onHostKind(value as HostKind), [onHostKind]);
  return (
    <Stack gap="sm">
      <Field label="Host" inline>
        <Select value={host.kind} options={HOST_OPTIONS} onChange={setKind} />
      </Field>
      {host.kind === 'local' && (
        <Field label="Port" inline>
          <NumberInput value={host.port} min={1} max={65535} onChange={onPort} />
        </Field>
      )}
      {host.kind === 'archipelago-gg' && <Text variant="caption">The seed is uploaded to archipelago.gg, which hosts the room.</Text>}
      {host.kind === 'remote' && (serverOptions.length
        ? (
          <Field label="Server" inline>
            <Select value={host.serverId} options={serverOptions} placeholder="Pick a server" onChange={onRemoteServer} />
          </Field>
        )
        : <Text variant="caption">No remote server yet. Add one in Servers.</Text>)}
    </Stack>
  );
};

export { HostFields };
