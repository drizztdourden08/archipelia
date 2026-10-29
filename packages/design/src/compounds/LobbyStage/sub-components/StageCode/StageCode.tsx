/* @layer renderer-app @kind component */
import { CopyButton } from '@drizztdourden08/tessera/composites';
import { Text } from '@drizztdourden08/tessera/primitives';
import type { StageCodeProps } from './StageCode.type';

const StageCode = ({ label, value, copyLabel }: StageCodeProps) => (
  <>
    <Text as="span" variant="overline" tone="dim">{label}</Text>
    <Text as="span" mono className="lobby-stage__code">{value}</Text>
    <CopyButton text={value} label={copyLabel} variant="ghost" size="sm" showLabel />
  </>
);

export { StageCode };
