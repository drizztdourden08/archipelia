/* @layer renderer-app @kind component */
import { Table, TableCell, TableRow, TableSection, Text } from '@drizztdourden08/tessera/primitives';
import { TEXT } from '../../History.constants';
import { DetailSection } from '../DetailSection';
import type { OverridesSectionProps } from './OverridesSection.type';

const valueOf = (value: string): string => value || 'none';

const OverridesSection = ({ overrides }: OverridesSectionProps) => (
  <DetailSection title="Changes for this run">
    {overrides.length === 0
      ? <Text variant="caption">{TEXT.noChanges}</Text>
      : (
        <Table striped aria-label="Changes for this run">
          <TableSection head>
            <TableRow>
              <TableCell header>Setting</TableCell>
              <TableCell header>Saved</TableCell>
              <TableCell header>Ran with</TableCell>
            </TableRow>
          </TableSection>
          <TableSection>
            {overrides.map((override) => (
              <TableRow key={override.field}>
                <TableCell>{override.label}</TableCell>
                <TableCell>{valueOf(override.from)}</TableCell>
                <TableCell>{valueOf(override.to)}</TableCell>
              </TableRow>
            ))}
          </TableSection>
        </Table>
      )}
  </DetailSection>
);

export { OverridesSection };
