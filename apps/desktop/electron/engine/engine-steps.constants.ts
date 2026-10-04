/* @layer electron-main @kind config */
import type { JobStepDef } from '@drizztdourden08/brock-core/types';

const ENGINE_STEPS: JobStepDef[] = [
  { id: 'python', label: 'Download Python', weight: 2 },
  { id: 'archipelago', label: 'Download Archipelago', weight: 2 },
  { id: 'requirements', label: 'Install the requirements', weight: 5 },
  { id: 'official', label: 'Pack the official worlds', weight: 1 },
];

const ENGINE_JOB_TITLE = 'Setting up the engine';

export { ENGINE_JOB_TITLE, ENGINE_STEPS };
