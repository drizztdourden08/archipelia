/* @layer renderer-app @kind hook */
import { useJob } from '@drizztdourden08/brock-react';
import type { BuildLogView } from '@archipelia/design';
import { BUILD_JOB, TOOL_JOB } from '@archipelia/model';

const useBuildLog = (): BuildLogView => {
  const venv = useJob(BUILD_JOB.venv).job;
  const tools = useJob(BUILD_JOB.tools).job;
  const wheel = useJob(BUILD_JOB.wheel).job;
  const none = useJob(TOOL_JOB.none).job;
  const system = useJob(TOOL_JOB.system).job;
  const latest = [venv, tools, wheel, none, system].flatMap((job) => job ?? []).sort((left, right) => right.startedAt - left.startedAt)[0];
  return { lines: latest?.log.map((line) => line.message) ?? [], label: latest?.title, progress: latest?.progress ?? 0 };
};

export { useBuildLog };
