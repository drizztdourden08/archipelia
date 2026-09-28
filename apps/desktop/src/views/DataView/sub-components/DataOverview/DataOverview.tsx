/* @layer renderer-app @kind component */
import { formatBytes } from '@drizztdourden08/brock-core/format';
import { Button, ButtonRow, Card, Grid, Icon, Stack, StatRow, Text } from '@drizztdourden08/tessera/primitives';
import type { DataOverviewProps } from './DataOverview.type';

const DataOverview = ({ summary, onReveal }: DataOverviewProps) => (
  <Stack>
    <Text variant="caption">{summary ? `${summary.location.path} · ${formatBytes(summary.totalBytes)}` : 'Reading the data folder'}</Text>
    <ButtonRow align="start">
      <Button variant="secondary" disabled={!summary?.location.canReveal} onClick={onReveal}><Icon name="folder" />Open folder</Button>
    </ButtonRow>
    <Grid minColWidth={240} gap="md">
      {(summary?.domains ?? []).map((domain) => (
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

export { DataOverview };
