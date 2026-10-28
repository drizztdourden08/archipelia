/* @layer renderer-app @kind component */
import { ItemList } from '@drizztdourden08/tessera/composites';
import type { ItemListRowParts } from '@drizztdourden08/tessera/composites';
import { Box, Icon } from '@drizztdourden08/tessera/primitives';
import type { ServerEntry, SessionTemplate } from '@archipelia/model';
import { TOUR_TARGET } from '../../../../hooks/tour-targets.constants';
import type { RunStats } from '../../../../runs/run-stats.type';
import { playersLabel } from '../../behavior/players-label';
import { whereLabel } from '../../behavior/where-label';
import { DATE_FORMAT, TEXT } from '../../Sessions.constants';
import { SessionMenu } from '../SessionMenu';
import { SessionMeta } from '../SessionMeta';
import type { SessionsListProps } from './SessionsList.type';

const lastRunLabel = (stats: RunStats | undefined) => (stats ? `last run ${DATE_FORMAT.format(stats.last)}` : TEXT.neverRun);

const rowParts = (template: SessionTemplate, servers: ServerEntry[], stats: RunStats | undefined): ItemListRowParts => ({
  icon: <Icon name="layers" />,
  meta: <SessionMeta where={whereLabel(template, servers)} players={playersLabel(template.players.length)} last={lastRunLabel(stats)} />,
});

const SessionsList = ({ templates, servers, stats, selectedId, loading, isBusy, onSelect, onDuplicate, onDelete }: SessionsListProps) => (
  <Box data-tour={TOUR_TARGET.sessionsList}>
    <ItemList
      title="Sessions"
      showTitle={false}
      items={templates}
      getId={(template) => template.id}
      getName={(template) => template.name}
      render={(template) => rowParts(template, servers, stats[template.id])}
      rowActions={(template) => <SessionMenu id={template.id} name={template.name} busy={isBusy(template.id)} onDuplicate={onDuplicate} onDelete={onDelete} />}
      actionVisibility="always"
      selectedId={selectedId}
      onSelect={onSelect}
      loading={loading}
      empty={TEXT.noSessions}
      filter
      filterPlaceholder="Filter sessions"
    />
  </Box>
);

export { SessionsList };
