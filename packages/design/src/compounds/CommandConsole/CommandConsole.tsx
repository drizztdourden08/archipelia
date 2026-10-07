/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { CommandInput, LogPanel } from '@drizztdourden08/tessera/composites';
import { Stack } from '@drizztdourden08/tessera/primitives';
import { CONSOLE_KINDS, CONSOLE_ROW_LIMIT } from './CommandConsole.constants';
import { lastRows } from './behavior/last-rows';
import type { CommandConsoleProps } from './CommandConsole.type';
import './CommandConsole.css';

const CommandConsole = (props: CommandConsoleProps) => {
  const { rows, onSubmit, history, value, onValueChange, disabled, actions, label, placeholder, emptyLabel, limit = CONSOLE_ROW_LIMIT } = props;
  const shown = useMemo(() => lastRows(rows, limit), [rows, limit]);
  return (
    <Stack gap="sm" className="command-console">
      <LogPanel rows={shown} kinds={CONSOLE_KINDS} height="fill" toolbar={false} emptyLabel={emptyLabel} />
      <CommandInput
        label={label}
        placeholder={placeholder}
        history={history}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        actions={actions}
        onSubmit={onSubmit}
      />
    </Stack>
  );
};

export { CommandConsole };
