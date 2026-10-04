/* @layer electron-main @kind logic */
import type { JobStepDef } from '@drizztdourden08/brock-core/types';
import type { Session } from '@archipelia/model';
import { ENGINE_STEPS, HOST_LABELS, HOST_STEP } from './run-steps.constants';

const runJobSteps = (session: Session): JobStepDef[] => [
  ...ENGINE_STEPS.map(({ id, label, weight }) => ({ id, label: label(session.snapshot.players.length), weight })),
  { id: HOST_STEP, label: HOST_LABELS[session.snapshot.host.kind], weight: 2 },
];

export { runJobSteps };
