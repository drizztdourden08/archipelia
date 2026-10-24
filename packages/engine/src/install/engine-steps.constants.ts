/* @layer core @kind config */
import type { JobStepDef } from '@drizztdourden08/brock-core/types';

const ENGINE_STEPS: JobStepDef[] = [
  { id: 'resolve', label: 'Check the versions', weight: 1 },
  { id: 'python', label: 'Download Python', weight: 2 },
  { id: 'archipelago', label: 'Download Archipelago', weight: 2 },
  { id: 'requirements', label: 'Install the requirements', weight: 5 },
  { id: 'official', label: 'Pack the official worlds', weight: 1 },
  { id: 'worlds', label: 'Carry your worlds', weight: 1 },
  { id: 'smoke', label: 'Test the engine', weight: 2 },
  { id: 'switch', label: 'Switch to it', weight: 1 },
];

const SWITCH_STEPS: JobStepDef[] = [
  { id: 'worlds', label: 'Carry your worlds', weight: 3 },
  { id: 'switch', label: 'Switch to it', weight: 1 },
];

const ENGINE_JOB_TITLE = 'Installing the engine';

const SWITCH_JOB_TITLE = 'Switching the engine';

export { ENGINE_JOB_TITLE, ENGINE_STEPS, SWITCH_JOB_TITLE, SWITCH_STEPS };
