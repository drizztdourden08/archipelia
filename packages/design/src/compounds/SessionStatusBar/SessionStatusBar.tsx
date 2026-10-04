/* @layer renderer-app @kind component */
import { Button, ButtonRow, Flex, Status, Text } from '@drizztdourden08/tessera/primitives';
import type { SessionStatusBarProps } from './SessionStatusBar.type';
import { StatusFact } from './sub-components/StatusFact';
import './SessionStatusBar.css';

const SessionStatusBar = (props: SessionStatusBarProps) => {
  const {
    status, statusTone, name, host, address, roomUrl, seed, uptime, progress, copied, stoppable,
    onResetLayout, onCopy, onStop,
  } = props;
  return (
    <Flex className="session-status-bar" align="center" justify="between" wrap gap="sm">
      <Flex align="center" wrap gap="md">
        <Status tone={statusTone} variant="pill">{status}</Status>
        <Text variant="subtitle">{name}</Text>
        <StatusFact label={host} value={address ?? 'no address yet'} />
        {roomUrl && <StatusFact label="room" value={roomUrl} />}
        {seed && <StatusFact label="seed" value={seed} />}
        {uptime && <StatusFact label="uptime" value={uptime} />}
        {progress && <StatusFact label="stage" value={progress} />}
      </Flex>
      <ButtonRow gap="xs">
        <Button size="sm" variant="ghost" onClick={onResetLayout}>Reset layout</Button>
        <Button size="sm" variant="secondary" disabled={!address} onClick={onCopy}>{copied ? 'Copied' : 'Copy address'}</Button>
        <Button size="sm" variant="danger" disabled={!stoppable} onClick={onStop}>Stop</Button>
      </ButtonRow>
    </Flex>
  );
};

export { SessionStatusBar };
