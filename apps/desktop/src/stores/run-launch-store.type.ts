/* @layer renderer-app @kind types */
import type { RunLaunch } from '../runs/run-launch.type';

type RunLaunchState = {
  launch: RunLaunch | null;
  begin: (launch: RunLaunch | null) => void;
};

export type { RunLaunchState };
