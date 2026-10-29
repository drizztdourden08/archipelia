/* @layer renderer-app @kind component */
import { useMemo, useState } from 'react';
import { Box, EmptyState, SearchInput, Spinner, Stack } from '@drizztdourden08/tessera/primitives';
import { TOUR_TARGET } from '../../../../hooks/tour-targets.constants';
import { placeIcon } from '../../behavior/place-icon';
import { sessionSummary } from '../../behavior/session-summary';
import { TEXT } from '../../Sessions.constants';
import { SessionListRow } from '../SessionListRow';
import type { SessionListProps } from './SessionList.type';
import './SessionList.css';

const SessionList = ({ templates, servers, stats, selectedId, withTab, dirty, loading, isBusy, onSelect, onDuplicate, onDelete }: SessionListProps) => {
  const [query, setQuery] = useState('');
  const shown = useMemo(() => {
    const words = query.trim().toLowerCase();
    return words ? templates.filter((template) => template.name.toLowerCase().includes(words)) : templates;
  }, [query, templates]);
  const empty = templates.length === 0 ? TEXT.noSessions : `${TEXT.noMatch} ${query.trim()}`;
  return (
    <Stack gap="sm" data-tour={TOUR_TARGET.sessionsList}>
      <SearchInput aria-label={TEXT.filter} placeholder={TEXT.filter} value={query} onChange={setQuery} />
      {loading && templates.length === 0 && <EmptyState icon={<Spinner />} message={TEXT.loading} />}
      {!loading && shown.length === 0 && <EmptyState message={empty} />}
      {shown.length > 0 && (
        <Box as="ul" aria-label={TEXT.list} className="session-list">
          {shown.map((template) => (
            <SessionListRow
              key={template.id}
              id={template.id}
              name={template.name}
              summary={sessionSummary(template, servers, stats[template.id])}
              place={placeIcon(template)}
              selected={template.id === selectedId}
              tabOpen={withTab.has(template.id)}
              unsaved={dirty && template.id === selectedId}
              busy={isBusy(template.id)}
              onSelect={onSelect}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
        </Box>
      )}
    </Stack>
  );
};

export { SessionList };
