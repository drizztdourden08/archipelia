/* @layer renderer-app @kind component */
import { Callout } from '@drizztdourden08/tessera/primitives';
import { TEXT } from '../../HostChoice.constants';
import type { NetworkNoticesProps } from '../../HostChoice.type';

const NetworkNotices = ({ status, open }: NetworkNoticesProps) => (
  <>
    {status.error && <Callout tone="danger">{`The lobby server did not start: ${status.error}`}</Callout>}
    {open && status.automation && <Callout tone="info">{TEXT.automated}</Callout>}
    {open && status.options.mode === 'lan-and-internet' && <Callout tone="info">{TEXT.internet}</Callout>}
  </>
);

export { NetworkNotices };
