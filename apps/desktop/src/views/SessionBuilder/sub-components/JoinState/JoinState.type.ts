/* @layer renderer-app @kind types */
import type { DirectConnection } from '@archipelia/model';
import type { useSessionPlace } from '../../behavior/useSessionPlace';

type JoinStateProps = { direct?: DirectConnection; place: ReturnType<typeof useSessionPlace>; closing: boolean };

export type { JoinStateProps };
