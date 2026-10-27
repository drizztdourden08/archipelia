/* @layer renderer-app @kind component */
import { Box, Callout, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { buildOf } from '../../behavior/build-of';
import { BUILD_TEXT } from '../../PackageSourceDialog.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';
import { MEGABYTE } from './ToolsStep.constants';

const ToolsStep = ({ view }: StepBodyProps) => {
  const build = buildOf(view.stage);
  const { candidate } = view;
  if (!build || !candidate) return null;
  return (
    <Stack gap="md">
      {build.rust && <Callout tone="warning">{BUILD_TEXT.rustNetwork}</Callout>}
      {build.confined ? <Text variant="caption" tone="dim">{build.rust ? BUILD_TEXT.confinedRust : BUILD_TEXT.confined}</Text> : <Callout tone="warning">{BUILD_TEXT.unconfined}</Callout>}
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
    </Stack>
  );
};

export { ToolsStep };
