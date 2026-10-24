/* @layer renderer-app @kind component */
import { Callout } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { ROOM_PASSWORDS_IN_MEMORY } from '../../../../lobbies/lobbies.constants';
import type { LocalNoticesProps } from './LocalNotices.type';

const LocalNotices = ({ status, error }: LocalNoticesProps) => (
  <>
    {error && <ErrorCallout message={error} />}
    {status?.error && <Callout tone="danger">{`The lobby server did not start: ${status.error}`}</Callout>}
    {status?.roomPasswords === 'memory' && <Callout tone="info">{ROOM_PASSWORDS_IN_MEMORY}</Callout>}
    {status?.reach?.cgnat && <Callout tone="warning">{status.reach.cgnat}</Callout>}
  </>
);

export { LocalNotices };
