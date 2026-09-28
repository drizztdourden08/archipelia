/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ReleaseMode, RemainingMode } from '@archipelia/model';
import { Button, Field, Flex, NumberInput, Select, Stack, TextInput } from '@drizztdourden08/tessera/primitives';
import type { ServerFieldsProps } from './ServerFields.type';
import { RELEASE_OPTIONS, REMAINING_OPTIONS } from '../../ServerOptionsForm.constants';

const whole = (value: number) => (Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0);

const ServerFields = ({ server, password, hasPassword, onServer, onPassword, onClearPassword }: ServerFieldsProps) => {
  const setHintCost = useCallback((value: number) => onServer({ hintCost: Math.min(100, whole(value)) }), [onServer]);
  const setRelease = useCallback((value: string) => onServer({ releaseMode: value as ReleaseMode }), [onServer]);
  const setCollect = useCallback((value: string) => onServer({ collectMode: value as ReleaseMode }), [onServer]);
  const setRemaining = useCallback((value: string) => onServer({ remainingMode: value as RemainingMode }), [onServer]);
  const setShutdown = useCallback((value: number) => onServer({ autoShutdownMinutes: whole(value) }), [onServer]);
  return (
    <Stack gap="sm">
      <Field label="Room password" hint={hasPassword ? 'A password is stored. Type to replace it.' : 'Optional. Kept in the vault, never in the template.'}>
        <Flex gap="sm" align="center">
          <TextInput type="password" autoComplete="new-password" value={password} placeholder={hasPassword ? 'stored' : 'optional'} onChange={(event) => onPassword(event.target.value)} />
          {hasPassword && <Button size="sm" variant="ghost" onClick={onClearPassword}>Clear</Button>}
        </Flex>
      </Field>
      <Field label="Hint cost, percent of checks" inline>
        <NumberInput value={server.hintCost} min={0} max={100} onChange={setHintCost} />
      </Field>
      <Field label="Release" inline>
        <Select value={server.releaseMode} options={RELEASE_OPTIONS} onChange={setRelease} />
      </Field>
      <Field label="Collect" inline>
        <Select value={server.collectMode} options={RELEASE_OPTIONS} onChange={setCollect} />
      </Field>
      <Field label="Remaining" inline>
        <Select value={server.remainingMode} options={REMAINING_OPTIONS} onChange={setRemaining} />
      </Field>
      <Field label="Auto shutdown, minutes idle" hint="0 keeps the server up." inline>
        <NumberInput value={server.autoShutdownMinutes} min={0} onChange={setShutdown} />
      </Field>
    </Stack>
  );
};

export { ServerFields };
