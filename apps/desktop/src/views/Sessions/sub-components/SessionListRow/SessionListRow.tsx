/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Box, Icon, Pressable, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { TEXT } from '../../Sessions.constants';
import { SessionMenu } from '../SessionMenu';
import type { SessionListRowProps } from './SessionListRow.type';
import './SessionListRow.css';

const SessionListRow = ({ id, name, summary, place, selected, tabOpen, unsaved, busy, onSelect, onDuplicate, onDelete }: SessionListRowProps) => {
  const pick = useCallback(() => onSelect(id), [id, onSelect]);
  return (
    <Box as="li" className={selected ? 'session-list-row session-list-row--selected' : 'session-list-row'}>
      <Pressable className="session-list-row__pick" aria-current={selected ? 'true' : undefined} onClick={pick}>
        <Icon name={place} className="session-list-row__icon" />
        <Box className="session-list-row__text">
          <Box className="session-list-row__head">
            <Text variant="body" className="session-list-row__name">{name}</Text>
            {unsaved && <Tag variant="urgency" color="warning">{TEXT.unsaved}</Tag>}
            {tabOpen && <Tag variant="urgency" color="info">{TEXT.tabOpen}</Tag>}
          </Box>
          <Text variant="caption" tone="muted" className="session-list-row__summary">{summary}</Text>
        </Box>
      </Pressable>
      <Box className="session-list-row__menu">
        <SessionMenu id={id} name={name} busy={busy} onDuplicate={onDuplicate} onDelete={onDelete} />
      </Box>
    </Box>
  );
};

export { SessionListRow };
