/* @layer renderer-app @kind component */
import { SearchAnchor } from '@drizztdourden08/brock-react';
import { Button, EmptyState, Flex, Spinner, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { PresetListProps } from './PresetList.type';
import { ErrorCallout, PresetListItem } from '@archipelia/design';
import { presetAnchor } from '../../behavior/preset-anchor';

const PresetList = ({ groups, total, selectedId, loading, error, onRetry, canCreate, onSelect, onNew, onOpenGames }: PresetListProps) => (
  <Stack gap="md">
    <Flex justify="between" align="center">
      <Text variant="label">Presets · {total}</Text>
      <Button size="sm" variant="primary" onClick={onNew} disabled={!canCreate}>New preset</Button>
    </Flex>
    {!loading && !canCreate && (
      <Flex gap="sm" align="center" justify="between" wrap>
        <Text variant="caption">No game is installed yet, so there is nothing to make a preset for.</Text>
        <Button size="sm" variant="secondary" onClick={onOpenGames}>Open Games</Button>
      </Flex>
    )}
    {error && <ErrorCallout message={error} onRetry={onRetry} />}
    {groups.length === 0 && loading && <EmptyState icon={<Spinner />} message="Loading presets" />}
    {groups.length === 0 && !loading && !error && canCreate && <EmptyState message="No preset yet. Press New preset to make one." />}
    {groups.map((group) => (
      <Stack key={group.game} gap="xs">
        <Text variant="caption" className="presets-hub__game">
          {group.schema ? group.game : `${group.game} · game not installed`}
        </Text>
        {group.rows.length === 0 && <EmptyState message="No presets yet" />}
        {group.rows.map((row) => (
          <SearchAnchor key={row.preset.id} anchor={presetAnchor(row.preset.id)}>
            <PresetListItem
              id={row.preset.id}
              name={row.preset.name}
              meta={row.meta}
              selected={row.preset.id === selectedId}
              unavailable={!group.schema}
              onSelect={onSelect}
            />
          </SearchAnchor>
        ))}
      </Stack>
    ))}
  </Stack>
);

export { PresetList };
