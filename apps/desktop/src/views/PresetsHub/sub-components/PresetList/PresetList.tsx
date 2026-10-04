/* @layer renderer-app @kind component */
import { Box, Button, Callout, EmptyState, Flex, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { PresetListProps } from './PresetList.type';
import { PresetListItem } from '@archipelia/design';

const PresetList = ({ groups, total, selectedId, loading, error, canCreate, onSelect, onNew }: PresetListProps) => (
  <Stack gap="md">
    <Flex justify="between" align="center">
      <Text variant="label">Presets · {total}</Text>
      <Button size="sm" variant="primary" onClick={onNew} disabled={!canCreate} title={canCreate ? undefined : 'Install a game first'}>New</Button>
    </Flex>
    {error && <Box role="alert"><Callout tone="danger">{error}</Callout></Box>}
    {groups.length === 0 && <EmptyState message={loading ? 'Loading presets' : 'Install a game from Games, then make a preset for it.'} />}
    {groups.map((group) => (
      <Stack key={group.game} gap="xs">
        <Text variant="caption" className="presets-hub__game">
          {group.schema ? group.game : `${group.game} · game not installed`}
        </Text>
        {group.rows.length === 0 && <EmptyState message="No presets yet" />}
        {group.rows.map((row) => (
          <PresetListItem
            key={row.preset.id}
            id={row.preset.id}
            name={row.preset.name}
            meta={row.meta}
            selected={row.preset.id === selectedId}
            unavailable={!group.schema}
            onSelect={onSelect}
          />
        ))}
      </Stack>
    ))}
  </Stack>
);

export { PresetList };
