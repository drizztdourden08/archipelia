/* @layer renderer-app @kind component */
import { Field, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { PLAN_TEXT } from '../../PackageSourceDialog.constants';
import type { WheelDetailsProps } from './WheelDetails.type';

const WheelDetails = ({ plan, wheel, typed, onTyped }: WheelDetailsProps) => (
  <Stack gap="sm" aria-label={wheel.asset}>
    {wheel.newest && <Text tone="warning">{PLAN_TEXT.wheelOlder(wheel.newest, wheel.tag)}</Text>}
    {wheel.digest === undefined && (
      <>
        <Text tone="warning">{PLAN_TEXT.wheelNoDigest}</Text>
        <Field label={PLAN_TEXT.wheelType(`${plan.owner}/${plan.repo}`)} width="md">
          <TextInput value={typed} onChange={(event) => onTyped(event.target.value)} />
        </Field>
      </>
    )}
  </Stack>
);

export { WheelDetails };
