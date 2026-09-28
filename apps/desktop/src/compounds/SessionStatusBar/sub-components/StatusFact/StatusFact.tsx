/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import type { StatusFactProps } from './StatusFact.type';

const StatusFact = ({ label, value }: StatusFactProps) => (
  <Text variant="caption" className="session-status-bar__fact">
    {label} <Text as="span" className="session-status-bar__value">{value}</Text>
  </Text>
);

export { StatusFact };
