/* @layer core @kind logic */
import type { ReleaseState } from '../first-party/first-party.type';
import { standardState } from '../first-party/standard-state';
import type { Expected } from '../first-party/standard-state.type';
import { MAX_READY_WORLD_BYTES } from './ready.constants';

const sizeOf = (state: ReleaseState): number => {
  if (state.kind === 'found') return state.manifest.size ?? 0;
  return state.kind === 'builds' ? Math.max(0, ...state.manifest.builds.map((build) => build.size)) : 0;
};

const stateOfManifest = (manifest: Record<string, unknown> | null, expected?: Expected): ReleaseState => {
  if (manifest === null) return { kind: 'none' };
  try {
    const state = standardState(manifest, expected);
    return sizeOf(state) > MAX_READY_WORLD_BYTES ? { kind: 'failed', message: 'the apworld is larger than 64 MiB' } : state;
  } catch (error) {
    return { kind: 'failed', message: error instanceof Error ? error.message : String(error) };
  }
};

export { stateOfManifest };
