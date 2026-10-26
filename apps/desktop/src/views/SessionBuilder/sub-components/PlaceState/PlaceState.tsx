/* @layer renderer-app @kind component */
import { NetworkState } from '../NetworkState';
import { RemoteState } from '../RemoteState';
import type { PlaceStateProps } from './PlaceState.type';

const PlaceState = ({ direct, place }: PlaceStateProps) => {
  if (!direct) return null;
  if (place.place === 'remote') return <RemoteState serverId={direct.serverId} stillOpen={place.stillOpen} busy={place.busy} onStop={place.stop} />;
  return place.status ? <NetworkState open={place.place === 'lan'} status={place.status} busy={place.busy} onStop={place.stop} /> : null;
};

export { PlaceState };
