/* @layer renderer-app @kind component */
import { Box, Button, Callout, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { BUILD_TEXT } from '../../PackageSourceDialog.constants';
import type { BuildReadyProps } from '../../PackageSourceDialog.type';
import { MEGABYTE } from './BuildReady.constants';

const BuildReady = ({ module, candidate, build, onBuildStart }: BuildReadyProps) => (
  <Stack gap="md">
    <Text variant="label">{BUILD_TEXT.readyHeading(module)}</Text>
    <Callout tone="warning">{BUILD_TEXT.warning(candidate.id)}</Callout>
    {build.confined ? <Text variant="caption" tone="dim">{BUILD_TEXT.confined}</Text> : <Callout tone="warning">{BUILD_TEXT.unconfined}</Callout>}
    <Stack gap="xs">
      <Text>{BUILD_TEXT.source(candidate.id, build.commit.slice(0, 7))}</Text>
      <Text variant="caption" tone="dim">{BUILD_TEXT.size((build.size / MEGABYTE).toFixed(1))}</Text>
      <Text mono variant="caption" tone="dim">{BUILD_TEXT.checksum(build.archiveSha256)}</Text>
      <Text variant="caption" tone="dim">{BUILD_TEXT.checksumNote}</Text>
    </Stack>
    <Stack gap="xs" as="section" aria-label={BUILD_TEXT.tools}>
      <Text variant="caption" tone="dim">{build.tools.length > 0 ? BUILD_TEXT.tools : BUILD_TEXT.noTools}</Text>
      <Stack gap="xs" as="ul" className="package-source__list">
        {build.tools.map((tool) => <Box as="li" key={tool.pin}><Text mono>{`${tool.name} ${tool.version}`}</Text></Box>)}
      </Stack>
    </Stack>
    <Flex>
      <Button variant="primary" icon={<Icon name="wrench" />} onClick={() => onBuildStart(build)}>{BUILD_TEXT.action(module)}</Button>
    </Flex>
  </Stack>
);

export { BuildReady };
