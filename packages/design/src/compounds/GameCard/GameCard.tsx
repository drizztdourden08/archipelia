/* @layer renderer-app @kind component */
import { ItemCard } from '@drizztdourden08/tessera/composites';
import { Text, Tag } from '@drizztdourden08/tessera/primitives';
import { actionOf } from './behavior/action-of';
import { hasEyebrow } from './behavior/has-eyebrow';
import { GAME_STATUS, KIND_TONE, MAX_TAGS } from './GameCard.constants';
import type { GameCardProps } from './GameCard.type';
import { GameCardEyebrow } from './sub-components/GameCardEyebrow';
import { GameCardMedia } from './sub-components/GameCardMedia';
import { GameCardNotes } from './sub-components/GameCardNotes';
import './GameCard.css';

const GameCard = ({ title, kind, kindLabel, version, status, notes, tags, actions, art, verified, direct, prerelease, onOpen }: GameCardProps) => {
  const state = status ? GAME_STATUS[status] : undefined;
  return (
    <ItemCard
      className={`game-card game-card--${kind}`}
      density="compact"
      mediaTone={KIND_TONE[kind]}
      mediaLabel={kindLabel}
      media={<GameCardMedia kind={kind} kindLabel={kindLabel} art={art} />}
      title={title}
      eyebrow={hasEyebrow({ verified, direct, prerelease }) ? <GameCardEyebrow verified={verified} direct={direct} prerelease={prerelease} /> : undefined}
      status={state && { label: state.label, tone: state.tone }}
      tags={tags.slice(0, MAX_TAGS).map((tag) => <Tag key={tag}>{tag}</Tag>)}
      details={[
        ...(version ? [<Text key="version" variant="caption" mono numeric>{version}</Text>] : []),
        ...(notes.length > 0 ? [<GameCardNotes key="notes" notes={notes} />] : []),
      ]}
      actions={actions.map((action) => actionOf(action, title))}
      onOpen={onOpen}
    />
  );
};

export { GameCard };
