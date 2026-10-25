/* @layer renderer-app @kind component */
import { Box, Card, Flex, Icon, IconButton, Status, Tag, Text, Tooltip } from '@drizztdourden08/tessera/primitives';
import { GAME_STATUS, KIND_ICON, MAX_TAGS } from './GameCard.constants';
import type { GameCardProps } from './GameCard.type';
import './GameCard.css';

const GameCard = ({ title, kind, kindLabel, version, status, notes, tags, actions }: GameCardProps) => (
  <Card role="group" aria-label={title} className="game-card" data-kind={kind}>
    <Flex align="center" gap="sm">
      <Tooltip content={kindLabel} focusable>
        <Box className="game-card__kind" role="img" aria-label={kindLabel}><Icon name={KIND_ICON[kind]} size={18} /></Box>
      </Tooltip>
      <Box className="game-card__main">
        <Text variant="subtitle" className="game-card__title" title={title}>{title}</Text>
        <Flex align="center" gap="xs" wrap>
          {version && <Text variant="caption" mono numeric>{version}</Text>}
          {status && <Status map={GAME_STATUS} value={status} />}
          {notes.map((note) => (
            <Tooltip key={note.text} content={note.text} focusable>
              <Box as="span" className="game-card__note" data-warning={note.warning ? '' : undefined}><Icon name={note.icon} size={14} label={note.text} /></Box>
            </Tooltip>
          ))}
          {tags.slice(0, MAX_TAGS).map((tag) => <Tag key={tag}>{tag}</Tag>)}
        </Flex>
      </Box>
      <Flex gap="2xs" className="game-card__actions">
        {actions.map((action) => (
          <Tooltip key={action.id} content={action.label}>
            <IconButton
              size="sm"
              variant={action.primary ? 'primary' : 'ghost'}
              tone={action.tone}
              label={`${action.label} ${title}`}
              disabled={action.disabled}
              loading={action.loading}
              onClick={action.onClick}
            >
              <Icon name={action.icon} />
            </IconButton>
          </Tooltip>
        ))}
      </Flex>
    </Flex>
  </Card>
);

export { GameCard };
