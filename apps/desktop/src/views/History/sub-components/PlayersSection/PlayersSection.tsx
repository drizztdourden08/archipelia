/* @layer renderer-app @kind component */
import { Status, Table, TableCell, TableRow, TableSection, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { TEXT } from '../../History.constants';
import { DetailSection } from '../DetailSection';
import type { PlayersSectionProps } from './PlayersSection.type';

const PlayersSection = ({ rows, summary }: PlayersSectionProps) => (
  <DetailSection title="Players">
    <Text variant="caption">{summary ?? TEXT.noEnd}</Text>
    {rows.length === 0
      ? <Text variant="caption">{TEXT.noPlayers}</Text>
      : (
        <Table striped aria-label="Players">
          <TableSection head>
            <TableRow>
              <TableCell header>Slot</TableCell>
              <TableCell header>Player</TableCell>
              <TableCell header>Game</TableCell>
              <TableCell header>Final status</TableCell>
              <TableCell header>Checks</TableCell>
              <TableCell header>Goal reached</TableCell>
              <TableCell header>Origin</TableCell>
              <TableCell header>Client</TableCell>
              <TableCell header>Trust</TableCell>
            </TableRow>
          </TableSection>
          <TableSection>
            {rows.map((row) => (
              <TableRow key={row.slot}>
                <TableCell>{row.slot}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.game}</TableCell>
                <TableCell>{row.tone ? <Status tone={row.tone}>{row.status}</Status> : row.status}</TableCell>
                <TableCell>{row.checks}</TableCell>
                <TableCell>{row.goal}</TableCell>
                <TableCell>{row.origin && <Tag>{row.origin}</Tag>}</TableCell>
                <TableCell>{row.client}</TableCell>
                <TableCell>{row.trust}</TableCell>
              </TableRow>
            ))}
          </TableSection>
        </Table>
      )}
  </DetailSection>
);

export { PlayersSection };
