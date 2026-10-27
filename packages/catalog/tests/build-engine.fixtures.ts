/* @layer tests @kind fixture */
import { vi } from 'vitest';
import type { EngineRuntime, SourceBuildJob } from '@archipelia/model';
import type { BuildRun } from '../src/build/build.type';
import { archiveOf, PROJECT_FILES, TOOLS } from './build.fixtures';
import { wheelBytes } from './wheel.fixtures';

const ZIP = archiveOf(PROJECT_FILES);

const WHEEL_BYTES = wheelBytes({ requires: ['numpy==2.5.1'] });

type Behaviour = {
  runtime: EngineRuntime | undefined;
  tags: string[];
  runs: Partial<Record<SourceBuildJob, BuildRun>>;
  wheel: Uint8Array | undefined;
  served: Uint8Array;
};

const behaviour: Behaviour = { runtime: undefined, tags: [], runs: {}, wheel: WHEEL_BYTES, served: ZIP };

type Pinned = Omit<(typeof TOOLS)[number], 'sha256'> & { sha256?: string | undefined };

const engine = {
  readRuntime: vi.fn(() => Promise.resolve(behaviour.runtime)),
  engineTags: vi.fn(() => Promise.resolve(behaviour.tags)),
  resolvePackages: vi.fn((_runtime: unknown, _specs: unknown, _options?: unknown): Promise<Pinned[]> => Promise.resolve(TOOLS)),
};

const mockedEngine = async () => ({ ...(await vi.importActual<object>('@archipelia/engine')), ...engine });

export { behaviour, engine, mockedEngine, WHEEL_BYTES, ZIP };
