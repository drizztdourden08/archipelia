/* @layer renderer-app @kind component */
import { Flex, Inline, Text } from '@drizztdourden08/tessera/primitives';
import type { PanelHeadingProps } from './PanelHeading.type';

const PanelHeading = ({ title, status, actions }: PanelHeadingProps) => (
  <Flex justify="between" align="center" wrap>
    <Inline gap="sm" align="center">
      <Text as="h2" variant="subtitle">{title}</Text>
      {status}
    </Inline>
    {actions}
  </Flex>
);

export { PanelHeading };
