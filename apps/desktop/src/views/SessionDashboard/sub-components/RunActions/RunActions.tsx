/* @layer renderer-app @kind component */
import { Button, Icon } from '@drizztdourden08/tessera/primitives';
import { CopyButton } from '@drizztdourden08/tessera/composites';
import { RUN_STAGE_TEXT } from '../../behavior/run-stage.constants';
import type { RunActionsProps } from './RunActions.type';

const RunActions = ({ address, stoppable, onStop }: RunActionsProps) => (
  <>
    <CopyButton text={address ?? ''} label={RUN_STAGE_TEXT.copyAddress} showLabel variant="secondary" disabled={!address} />
    <Button variant="danger" icon={<Icon name="square" />} disabled={!stoppable} onClick={onStop}>{RUN_STAGE_TEXT.stop}</Button>
  </>
);

export { RunActions };
