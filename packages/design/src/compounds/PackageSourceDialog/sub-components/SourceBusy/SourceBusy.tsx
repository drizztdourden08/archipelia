/* @layer renderer-app @kind component */
import { Flex, Spinner, Text } from '@drizztdourden08/tessera/primitives';

const SourceBusy = ({ text }: { text: string }) => (
  <Flex align="center" gap="sm"><Spinner size="sm" label={text} /><Text>{text}</Text></Flex>
);

export { SourceBusy };
