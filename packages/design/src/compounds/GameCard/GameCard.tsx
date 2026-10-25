/* @layer renderer-app @kind component */
import { ItemCard } from '@drizztdourden08/tessera/composites';
import { Box, Icon, Tag, Text, Tooltip } from '@drizztdourden08/tessera/primitives';
import { actionOf } from './behavior/action-of';
import { GAME_STATUS, KIND_TONE, MAX_TAGS } from './GameCard.constants';
import type { GameCardNote, GameCardProps } from './GameCard.type';
import { GameCardMedia } from './sub-components/GameCardMedia';
import './GameCard.css';

const noteOf = (note: GameCardNote) => (
  <Tooltip key={note.text} content={note.text} focusable>
    <Box as="span" className="game-card__note" data-warning={note.warning ? '' : undefined}><Icon name={note.icon} size={14} label={note.text} /></Box>
  </Tooltip>
);

const summaryOf = (summary: string, hint?: string) => (
  <Text key="summary" variant="caption" tone="dim" title={hint ?? summary}>{summary}</Text>
);

const GameCard = ({ title, kind, kindLabel, version, status, notes, tags, actions, summary, summaryHint, art }: GameCardProps) => {
  const state = status ? GAME_STATUS[status] : undefined;
  return (
    <ItemCard
      className={`game-card game-card--${kind}`}
      density="compact"
      mediaSize="sm"
      mediaTone={KIND_TONE[kind]}
      media={<GameCardMedia kind={kind} kindLabel={kindLabel} art={art} />}
      title={title}
      status={state && { label: state.label, tone: state.tone }}
      details={[
        ...(version ? [<Text key="version" variant="caption" mono numeric>{version}</Text>] : []),
        ...notes.map(noteOf),
        ...tags.slice(0, MAX_TAGS).map((tag) => <Tag key={tag}>{tag}</Tag>),
        ...(summary ? [summaryOf(summary, summaryHint)] : []),
      ]}
      actions={actions.map(actionOf)}
    />
  );
};

export { GameCard };
