/* @layer renderer-app @kind component */
import { Callout } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import type { LocalNoticesProps } from './LocalNotices.type';

const LocalNotices = ({ status, error }: LocalNoticesProps) => (
  <>
    {error && <ErrorCallout message={error} />}
    {status?.error && <Callout tone="danger">{`The lobby server did not start: ${status.error}`}</Callout>}
    {status?.reach?.cgnat && <Callout tone="warning">{status.reach.cgnat}</Callout>}
  </>
);

export { LocalNotices };
