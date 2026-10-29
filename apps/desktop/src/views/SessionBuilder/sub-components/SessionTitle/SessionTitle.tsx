/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { InlineEdit } from '@drizztdourden08/tessera/composites';
import { Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { EDITOR_TEXT } from '../../SessionBuilder.constants';
import type { SessionTitleProps } from './SessionTitle.type';
import './SessionTitle.css';

const drawTitle = (value: string) => <Text as="span" variant="title" className="session-title__text">{value}</Text>;

const SessionTitle = ({ name, stored, onName }: SessionTitleProps) => {
  const type = useCallback((event: ChangeEvent<HTMLInputElement>) => onName(event.target.value), [onName]);
  if (!stored) {
    return <TextInput aria-label={EDITOR_TEXT.name} value={name} placeholder={EDITOR_TEXT.name} className="session-title__input" onChange={type} />;
  }
  return <InlineEdit label={EDITOR_TEXT.name} value={name} placeholder={EDITOR_TEXT.name} renderValue={drawTitle} className="session-title" onCommit={onName} />;
};

export { SessionTitle };
