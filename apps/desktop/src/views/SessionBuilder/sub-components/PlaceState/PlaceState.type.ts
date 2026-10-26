/* @layer renderer-app @kind types */
import type { DirectConnection } from '@archipelia/model';
import type { useSessionPlace } from '../../behavior/useSessionPlace';

type PlaceStateProps = { direct?: DirectConnection; place: ReturnType<typeof useSessionPlace> };

export type { PlaceStateProps };
