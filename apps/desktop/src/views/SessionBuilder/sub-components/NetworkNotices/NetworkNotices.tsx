/* @layer renderer-app @kind component */
import { Callout } from '@drizztdourden08/tessera/primitives';
import { NETWORK_TEXT } from '../../behavior/lobby-view.constants';
import type { NetworkNoticesProps } from './NetworkNotices.type';

const NetworkNotices = ({ status, open }: NetworkNoticesProps) => (
  <>
    {status.error && <Callout tone="danger">{`The lobby server did not start: ${status.error}`}</Callout>}
    {open && status.automation && <Callout tone="info">{NETWORK_TEXT.automated}</Callout>}
    {open && status.options.mode === 'lan-and-internet' && <Callout tone="info">{NETWORK_TEXT.internet}</Callout>}
  </>
);

export { NetworkNotices };
