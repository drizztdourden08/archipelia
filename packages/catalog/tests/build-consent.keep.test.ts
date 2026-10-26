/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import { consentOf, engine, GAME, registerBed } from './world-packages.fixtures';
import { cacheWheel, WHEEL, wheelBytes } from './wheel.fixtures';
import { COMMIT } from './build.fixtures';

vi.mock('@archipelia/engine', async () => (await import('./world-packages.fixtures')).mockedEngine());

const { commitInstall } = await import('../src/install/commit-install');
const { loadWheel } = await import('../src/wheel/load-wheel');

const world = registerBed();

const ARCHIVE = 'b'.repeat(64);

const MADE = { repo: 'Pseudoarc/ctrando', tag: COMMIT, asset: WHEEL, verified: true, built: true, commit: COMMIT, archiveSha256: ARCHIVE };

const withSha = (sha256: string, patch: object = {}) => ({ ...MADE, sha256, name: 'ctrando', version: '1.2.0', ...patch });

const storeBuilt = async (bytes = wheelBytes({ requires: ['numpy==2.5.1'] }), label: object = MADE) => {
  const stored = await cacheWheel(world.bed.runtime, bytes, { ...MADE, ...label });
  return { ...stored, source: withSha(stored.sha256) };
};

const approve = (...sources: object[]) => consentOf({ sources });

describe('a wheel built from source goes through the same install as a ready-made one', () => {
  test('asks first, and says it was built from the repo at the commit', async () => {
    const { sha256 } = await storeBuilt();
    await expect(commitInstall(await world.jobOf('', { wheels: [sha256] }))).rejects.toThrow(
      `${GAME} needs the Python packages ctrando 1.2.0 (built from Pseudoarc/ctrando at ${COMMIT.slice(0, 7)}), foo==1.0, dep-one==2.1.3. Nothing is installed into the engine until you accept.`,
    );
    expect([engine.installWheel, engine.installPackages].map((fn) => fn.mock.calls.length)).toEqual([0, 0]);
  });

  test('sends every Requires-Dist line of the built wheel through the Python Package Index resolve, which refuses a bad line', async () => {
    const { sha256, source } = await storeBuilt();
    await commitInstall(await world.jobOf('foo>=1\n', { wheels: [sha256], packages: approve(source) }));
    expect(engine.resolvePackages).toHaveBeenCalledWith(world.bed.runtime, ['foo>=1', 'numpy==2.5.1']);
    const hostile = await storeBuilt(wheelBytes({ version: '9.0.0', requires: ['evil @ git+https://evil.example/evil.git'] }), { asset: 'ctrando-9.0.0-cp312-cp312-win_amd64.whl' });
    const job = await world.jobOf('', { wheels: [hostile.sha256], packages: approve(hostile.source) });
    await expect(commitInstall(job)).rejects.toThrow('lists a requirement Archipelia will not install');
  });

  test('installs the built wheel by its hash with the hardened install, then records where it came from', async () => {
    const { sha256, file, source } = await storeBuilt();
    const record = await commitInstall(await world.jobOf('', { wheels: [sha256], packages: approve(source) }));
    expect(engine.installWheel).toHaveBeenCalledWith(world.bed.runtime, { file, sha256 });
    expect(record.sources).toEqual([{
      repo: 'Pseudoarc/ctrando', tag: COMMIT, asset: WHEEL, sha256, verified: true, name: 'ctrando', version: '1.2.0', built: true, commit: COMMIT, archiveSha256: ARCHIVE,
    }]);
    expect(record.packages).toEqual(['foo==1.0', 'dep-one==2.1.3']);
  });

  test('a consent for another commit, another source archive, a release instead of a build, or another wheel is refused', async () => {
    const { sha256 } = await storeBuilt();
    const others = [
      { commit: 'c'.repeat(40) }, { tag: 'c'.repeat(40) }, { archiveSha256: 'd'.repeat(64) }, { built: false },
      { built: undefined, commit: undefined, archiveSha256: undefined }, { repo: 'evil/ctrando' },
    ].map((patch) => withSha(sha256, patch));
    for (const other of [...others, withSha('f'.repeat(64))]) {
      await expect(commitInstall(await world.jobOf('', { wheels: [sha256], packages: approve(other) }))).rejects.toThrow('changed since you reviewed them');
    }
    expect([engine.installWheel, engine.installPackages].map((fn) => fn.mock.calls.length)).toEqual([0, 0]);
  });

  test.each([{ commit: 'not-a-commit' }, { archiveSha256: 'short' }, { commit: undefined }])(
    'a stored wheel whose record claims it was built with %j is not read',
    async (patch) => {
      const broken = await storeBuilt(wheelBytes({ version: '3.0.0' }), { ...patch, asset: 'ctrando-3.0.0-cp312-cp312-win_amd64.whl' });
      await expect(loadWheel(world.bed.runtime, broken.sha256)).rejects.toThrow('no longer there');
    },
  );

  test('a stored wheel with a full record is read with its commit and source checksum', async () => {
    const { sha256 } = await storeBuilt();
    expect((await loadWheel(world.bed.runtime, sha256)).source).toMatchObject({ built: true, commit: COMMIT, archiveSha256: ARCHIVE });
  });
});
