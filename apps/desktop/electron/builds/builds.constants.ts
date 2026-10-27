/* @layer electron-main @kind config */
import type { SourceBuildJob } from '@archipelia/model';

const BUILD_LABEL: Record<SourceBuildJob, string> = {
  venv: 'Setting up the private build folder',
  tools: 'Installing the build tools',
  wheel: 'Building the package',
};

const BUILD_TIMEOUT_MS: Record<SourceBuildJob, number> = {
  venv: 10 * 60 * 1000,
  tools: 20 * 60 * 1000,
  wheel: 90 * 60 * 1000,
};

const BUILD_JOBS: readonly SourceBuildJob[] = ['venv', 'tools', 'wheel'];

const BUILD_ALLOW = { env: ['PATH'] } as const;

export { BUILD_ALLOW, BUILD_JOBS, BUILD_LABEL, BUILD_TIMEOUT_MS };
