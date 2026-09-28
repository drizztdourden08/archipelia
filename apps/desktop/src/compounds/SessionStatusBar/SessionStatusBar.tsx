/* @layer renderer-app @kind component */
import { Badge, Button, ButtonRow, Flex, Text } from '@drizztdourden08/tessera/primitives';
import type { SessionStatusBarProps } from './SessionStatusBar.type';
import { StatusFact } from './sub-components/StatusFact';
import { WidgetToggle } from './sub-components/WidgetToggle';
import './SessionStatusBar.css';

const SessionStatusBar = (props: SessionStatusBarProps) => {
  const {
    status, statusVariant, name, host, address, roomUrl, seed, uptime, progress, copied, stoppable,
    widgets, onToggleWidget, onResetLayout, onCopy, onStop,
  } = props;
  return (
    <Flex className="session-status-bar" align="center" justify="between" wrap gap="sm">
      <Flex align="center" wrap gap="md">
        <Badge variant={statusVariant}>{status}</Badge>
        <Text variant="subtitle">{name}</Text>
        <StatusFact label={host} value={address ?? 'no address yet'} />
        {roomUrl && <StatusFact label="room" value={roomUrl} />}
        {seed && <StatusFact label="seed" value={seed} />}
        {uptime && <StatusFact label="uptime" value={uptime} />}
        {progress && <StatusFact label="stage" value={progress} />}
      </Flex>
      <ButtonRow gap="xs">
        {widgets.map((widget) => <WidgetToggle key={widget.id} {...widget} onToggle={onToggleWidget} />)}
        <Button size="sm" variant="ghost" onClick={onResetLayout}>Reset layout</Button>
        <Button size="sm" variant="secondary" disabled={!address} onClick={onCopy}>{copied ? 'Copied' : 'Copy address'}</Button>
        <Button size="sm" variant="danger" disabled={!stoppable} onClick={onStop}>Stop</Button>
      </ButtonRow>
    </Flex>
  );
};

export { SessionStatusBar };
