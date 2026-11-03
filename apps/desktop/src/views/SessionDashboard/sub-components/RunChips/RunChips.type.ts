/* @layer renderer-app @kind types */
import type { JobSnapshot } from '@drizztdourden08/brock-core';
import type { SessionStatus } from '@archipelia/model';

type RunChipsProps = {
  status: SessionStatus;
  job: JobSnapshot | null;
  place: string;
  lan: boolean;
  count: number;
  uptime: string | null;
};

export type { RunChipsProps };
