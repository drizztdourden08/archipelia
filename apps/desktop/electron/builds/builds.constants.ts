/* @layer electron-main @kind config */
import type { SourceBuildJob, SourceToolElevation } from '@archipelia/model';

const BUILD_LABEL: Record<SourceBuildJob, string> = {
  venv: 'Setting up the private build folder',
  tools: 'Installing the build tools',
  crates: 'Downloading the Rust crates',
  wheel: 'Building the package',
};

const BUILD_TIMEOUT_MS: Record<SourceBuildJob, number> = {
  venv: 10 * 60 * 1000,
  tools: 20 * 60 * 1000,
  crates: 20 * 60 * 1000,
  wheel: 90 * 60 * 1000,
};

const BUILD_JOBS: readonly SourceBuildJob[] = ['venv', 'tools', 'crates', 'wheel'];

const BUILD_ALLOW = { env: ['PATH'] } as const;

const TOOL_ELEVATIONS: readonly SourceToolElevation[] = ['none', 'system'];

const TOOL_LABEL: Record<SourceToolElevation, string> = {
  none: 'Installing the build tool',
  system: 'Installing the build tool, the system asks for permission',
};

const TOOL_TIMEOUT_MS: Record<SourceToolElevation, number> = { none: 30 * 60 * 1000, system: 90 * 60 * 1000 };

const TOOL_SUCCESS_CODES: readonly number[] = [0, 3010];

const TOOL_DETACHED = 'The installer may still be running. Wait for it to end, then click Check again.';

export { BUILD_ALLOW, BUILD_JOBS, BUILD_LABEL, BUILD_TIMEOUT_MS, TOOL_DETACHED, TOOL_ELEVATIONS, TOOL_LABEL, TOOL_SUCCESS_CODES, TOOL_TIMEOUT_MS };
