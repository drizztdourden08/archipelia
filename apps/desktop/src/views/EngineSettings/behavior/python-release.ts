/* @layer renderer-app @kind logic */
import type { EngineOverview } from '@archipelia/model';

const pythonRelease = ({ feed, installed }: EngineOverview, python: string): string | undefined =>
  feed.python.find((build) => build.version === python)?.release ?? installed.find((engine) => engine.python === python)?.pythonRelease;

export { pythonRelease };
