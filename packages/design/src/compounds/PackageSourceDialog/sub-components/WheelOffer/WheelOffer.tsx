/* @layer renderer-app @kind component */
import { Button, Field, Flex, Icon, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { useState } from 'react';
import { PLAN_TEXT } from '../../PackageSourceDialog.constants';
import type { WheelOfferProps } from '../../PackageSourceDialog.type';

const WheelOffer = ({ plan, installing, onUseWheel }: WheelOfferProps) => {
  const [typed, setTyped] = useState('');
  const { wheel, wheelState, owner, repo } = plan;
  const name = `${owner}/${repo}`;
  if (!wheel) return <Text tone="dim">{wheelState === 'unknown' ? PLAN_TEXT.wheelUnknown : PLAN_TEXT.wheelNone}</Text>;
  const unchecked = wheel.digest === undefined;
  const ready = !unchecked || typed.trim().toLowerCase() === name.toLowerCase();
  return (
    <Stack gap="sm" as="section" aria-label={wheel.asset}>
      <Text>{PLAN_TEXT.wheelFound(wheel.asset, wheel.tag)}</Text>
      <Text variant="caption" tone="dim">{PLAN_TEXT.wheelFit[wheel.fit]}</Text>
      {wheel.newest && <Text tone="warning">{PLAN_TEXT.wheelOlder(wheel.newest, wheel.tag)}</Text>}
      {unchecked && (
        <Stack gap="xs">
          <Text tone="warning">{PLAN_TEXT.wheelNoDigest}</Text>
          <Field label={PLAN_TEXT.wheelType(name)} width="md">
            <TextInput value={typed} onChange={(event) => setTyped(event.target.value)} />
          </Field>
        </Stack>
      )}
      <Flex>
        <Button variant="primary" icon={<Icon name="download" />} loading={installing} disabled={!ready} onClick={() => onUseWheel(typed)}>{PLAN_TEXT.wheelAction}</Button>
      </Flex>
    </Stack>
  );
};

export { WheelOffer };
