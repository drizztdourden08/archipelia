/* @layer renderer-app @kind component */
import { Box, Button, Flex, Icon, Text } from '@drizztdourden08/tessera/primitives';
import type { StageConfigProps } from './StageConfig.type';

const StageConfig = ({ label, facts, editLabel, onEdit }: StageConfigProps) => (
  <Flex as="footer" className="lobby-stage__config" gap="sm" align="center" wrap>
    <Icon name="sliders-horizontal" />
    <Text as="span" variant="overline" tone="dim">{label}</Text>
    <Flex as="dl" className="lobby-stage__facts" gap="md" align="center" wrap>
      {facts.map((fact) => (
        <Box key={fact.label} className="lobby-stage__fact">
          <Text as="dt" variant="caption" tone="dim">{fact.label}</Text>
          <Text as="dd" variant="caption" mono>{fact.value}</Text>
        </Box>
      ))}
    </Flex>
    <Button size="sm" variant="ghost" icon={<Icon name="pencil" />} onClick={onEdit}>{editLabel}</Button>
  </Flex>
);

export { StageConfig };
