/* @layer renderer-app @kind component */
import { SearchAnchor } from '@drizztdourden08/brock-react';
import { Button, Flex, Grid, Icon, SectionHeader, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { gameAnchor } from '../../behavior/game-anchor';
import { useCardLimit } from '../../behavior/useCardLimit';
import { NONE_INSTALLED, SECTIONS } from '../../GameStore.constants';
import { GameRowCard } from '../GameRowCard';
import type { GameSectionProps } from './GameSection.type';

const GameSection = ({ section, resetKey, filtered, handlers }: GameSectionProps) => {
  const { id, rows } = section;
  const cards = useCardLimit(rows.length, resetKey);
  const meta = SECTIONS.find((entry) => entry.id === id);
  if (!meta || (rows.length === 0 && (filtered || id !== 'installed'))) return null;

  return (
    <Stack gap="sm" as="section" aria-label={meta.title}>
      <SectionHeader level={2} title={<Flex as="span" align="center" gap="xs" inline><Icon name={meta.icon} size={14} />{meta.title}</Flex>} count={rows.length} />
      {rows.length === 0 && <Text variant="caption">{NONE_INSTALLED}</Text>}
      <Grid minColWidth={280} gap="sm">
        {rows.slice(0, cards.shown).map((row) => (
          <SearchAnchor key={`${row.entry.source}:${row.entry.apworld}`} anchor={gameAnchor(row.entry.apworld)} className="game-store__anchor">
            <GameRowCard row={row} handlers={handlers} />
          </SearchAnchor>
        ))}
      </Grid>
      {cards.hidden && (
        <Flex justify="center" align="center" gap="sm" wrap>
          <Text variant="caption">{`Showing ${cards.shown} of ${cards.total}: refine the search or show more.`}</Text>
          <Button size="sm" variant="secondary" onClick={cards.showMore}>Show more</Button>
        </Flex>
      )}
    </Stack>
  );
};

export { GameSection };
