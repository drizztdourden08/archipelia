/* @layer renderer-app @kind hook */
import { useJob } from '@drizztdourden08/brock-react';
import type { BuildLogView } from '@archipelia/design';
import { BUILD_JOB } from '@archipelia/model';

const useBuildLog = (): BuildLogView => {
  const venv = useJob(BUILD_JOB.venv).job;
  const tools = useJob(BUILD_JOB.tools).job;
  const wheel = useJob(BUILD_JOB.wheel).job;
  const latest = [venv, tools, wheel].flatMap((job) => job ?? []).sort((left, right) => right.startedAt - left.startedAt)[0];
  return { lines: latest?.log.map((line) => line.message) ?? [], label: latest?.title, progress: latest?.progress ?? 0 };
};

export { useBuildLog };
