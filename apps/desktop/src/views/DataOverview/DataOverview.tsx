/* @layer renderer-app @kind component */
import { formatBytes } from '@drizztdourden08/brock-core/format';
import { Box, Button, ButtonRow, Callout, Card, Flex, Grid, Icon, Spinner, Stack, StatRow, Text } from '@drizztdourden08/tessera/primitives';
import { useStorageSummary } from './behavior/useStorageSummary';

const DataOverview = () => {
  const { summary, error, retry, reveal } = useStorageSummary();
  if (!summary && error) {
    return (
      <Stack gap="sm">
        <Box role="alert"><Callout tone="danger">{`Could not read the data folder: ${error}`}</Callout></Box>
        <ButtonRow align="start">
          <Button variant="primary" onClick={retry} icon={<Icon name="refresh-cw" />}>Retry</Button>
        </ButtonRow>
      </Stack>
    );
  }
  if (!summary) {
    return (
      <Flex gap="sm" align="center">
        <Spinner size="sm" />
        <Text variant="caption">Reading the data folder</Text>
      </Flex>
    );
  }
  return (
    <Stack>
      <Text variant="caption">{`${summary.location.path} · ${formatBytes(summary.totalBytes)}`}</Text>
      {error && <Box role="alert"><Callout tone="danger">{`Could not refresh the data folder: ${error}`}</Callout></Box>}
      <ButtonRow align="start">
        <Button variant="secondary" disabled={!summary.location.canReveal} onClick={reveal} icon={<Icon name="folder" />}>Open folder</Button>
        {error && <Button variant="secondary" onClick={retry} icon={<Icon name="refresh-cw" />}>Retry</Button>}
      </ButtonRow>
      <Grid minColWidth={240} gap="md">
        {summary.domains.map((domain) => (
          <Card key={domain.domain}>
            <Stack gap="xs">
              <Text variant="subtitle">{domain.label}</Text>
              <StatRow label="Files" value={String(domain.count)} />
              <StatRow label="Size" value={formatBytes(domain.bytes)} />
            </Stack>
          </Card>
        ))}
      </Grid>
    </Stack>
  );
};

export { DataOverview };
