/* @layer renderer-app @kind component */
import { EmptyState, ScrollArea, Stack } from '@drizztdourden08/tessera/primitives';
import type { OverridesBodyProps } from './OverridesBody.type';
import { APP_FILE_TEXT } from '../../SessionLobby.constants';
import { OverrideRow } from '../OverrideRow';

const OverridesBody = ({ game, preset, readOnly, rows, onValue, onReset }: OverridesBodyProps) => {
  if (!game || !preset) return <EmptyState message={readOnly ? APP_FILE_TEXT.empty : 'Pick an installed game and a preset to change its options.'} />;
  return (
    <ScrollArea scrollbar="slim" className="session-lobby__override-rows">
      <Stack gap="xs">
        {rows.length === 0 && <EmptyState message="No option matches" />}
        {rows.map((row) => (
          <OverrideRow
            key={row.def.key}
            def={row.def}
            value={row.value}
            presetValue={row.presetValue}
            overridden={row.overridden}
            problem={row.problem}
            disabled={readOnly}
            onValue={onValue}
            onReset={onReset}
          />
        ))}
      </Stack>
    </ScrollArea>
  );
};

export { OverridesBody };
