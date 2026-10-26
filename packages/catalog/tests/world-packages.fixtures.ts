/* @layer tests @kind fixture */
import { mkdir, mkdtemp, rm, stat } from 'node:fs/promises';
import { afterAll, beforeAll, beforeEach, vi } from 'vitest';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { EngineRuntime } from '@archipelia/model';
import { readApworld } from '../src/install/read-apworld';
import { memoryFiles } from './memory-files.fixtures';
import { writeZip } from './zip-file.fixtures';
import { TAGS } from './wheel.fixtures';

const GAME = 'Chrono Trigger Rando-Dalton Imperial';

const RESOLVED = [
  { name: 'foo', version: '1.0', pin: 'foo==1.0', url: 'https://pypi.org/project/foo/1.0/', direct: true },
  { name: 'dep-one', version: '2.1.3', pin: 'dep-one==2.1.3', url: 'https://pypi.org/project/dep-one/2.1.3/', direct: false },
];

const MISSING = ['Traceback (most recent call last):', "ModuleNotFoundError: No module named 'ctrando'"];

const consentOf = (patch: object = {}) => ({ sha256: 'abc', packages: ['foo==1.0', 'dep-one==2.1.3'], ...patch });

const loaded = () => ({
  schemas: { [GAME]: { game: GAME, worldVersion: '1', groups: [], options: [], presets: {}, unsupported: [] } },
  errors: {}, failedWorlds: [], seconds: 1, lines: [],
});

const notLoaded = (lines: string[]) => ({ schemas: {}, errors: {}, failedWorlds: ['ctrdi'], seconds: 1, lines });

const resolveLike = (_runtime: unknown, specs: string[]) => Promise.resolve(specs.length > 0 ? RESOLVED : []);

const createBed = () => {
  const blank: EngineRuntime = {
    id: 'e', apVersion: '0.6.7', apCommit: '', pythonVersion: '3.12', root: '', python: 'python', generate: '', multiServer: '', schemaScript: '',
  };
  const bed = { base: '', runtime: blank };
  const write = (name: string, entries: Record<string, string>) => writeZip(bed.base, name, entries);
  const worldFile = (requirements?: string) => write('ctrdi.apworld', {
    'ctrdi/__init__.py': '', 'ctrdi/archipelago.json': `{"game":"${GAME}"}`, ...(requirements === undefined ? {} : { 'ctrdi/requirements.txt': requirements }),
  });
  const setup = async () => {
    bed.base = await mkdtemp(join(tmpdir(), 'archipelia-world-packages-'));
    bed.runtime = {
      id: 'e', apVersion: '0.6.7', apCommit: '', pythonVersion: '3.12', root: join(bed.base, 'engine'),
      python: 'python', generate: '', multiServer: '', schemaScript: '',
    };
    await mkdir(join(bed.runtime.root, 'ap', 'custom_worlds'), { recursive: true });
  };
  const jobOf = async (requirements: string | undefined, patch: object = {}) => {
    const file = await worldFile(requirements);
    return {
      runtime: bed.runtime, files: memoryFiles([]), file, info: await readApworld(file), apworld: 'ctrdi', game: GAME, source: 'index' as const,
      layout: 'apworld' as const, hash: { sha256: 'abc', verified: true }, requires: [], ...patch,
    };
  };
  const target = () => join(bed.runtime.root, 'ap', 'custom_worlds', 'ctrdi.apworld');
  return {
    bed, write, worldFile, jobOf, setup, target,
    teardown: () => rm(bed.base, { recursive: true, force: true }),
    clear: () => rm(target(), { force: true }),
    placed: () => stat(target()).then(() => true, () => false),
    files: () => memoryFiles([]),
  };
};

const pypi = vi.fn();

const engine = {
  installPackages: vi.fn(), readOptionsSchema: vi.fn(), resolvePackages: vi.fn(), readRuntime: vi.fn(), installWheel: vi.fn(), engineTags: vi.fn(),
};

const mockedEngine = async () => ({ ...(await vi.importActual<object>('@archipelia/engine')), ...engine });

const registerBed = () => {
  const bed = createBed();
  beforeAll(bed.setup);
  afterAll(async () => {
    vi.unstubAllGlobals();
    await bed.teardown();
  });
  beforeEach(async () => {
    await bed.clear();
    pypi.mockReset().mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', pypi);
    engine.installPackages.mockReset().mockResolvedValue(undefined);
    engine.resolvePackages.mockReset().mockImplementation(resolveLike);
    engine.readRuntime.mockReset().mockResolvedValue(bed.bed.runtime);
    engine.readOptionsSchema.mockReset().mockResolvedValue(loaded());
    engine.installWheel.mockReset().mockResolvedValue(undefined);
    engine.engineTags.mockReset().mockResolvedValue(TAGS);
  });
  return bed;
};

export { consentOf, engine, GAME, loaded, MISSING, mockedEngine, notLoaded, pypi, RESOLVED, registerBed };
