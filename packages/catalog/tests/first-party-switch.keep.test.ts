/* @layer tests @kind test */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { EngineRuntime, InstalledGame } from '@archipelia/model';
import { BUNDLE_URL, MANIFEST_URL, REGISTRY_URL, buildBundleUrl, buildUrl, buildsManifestOf, bytesResponse, json, missing, registryOf, routed, worldBytes } from './first-party.fixtures';
import { memoryFiles, recordOf } from './memory-files.fixtures';

const engineAp = vi.hoisted(() => ({ value: '0.6.7' }));
const placed = vi.hoisted(() => vi.fn((job: unknown) => Promise.resolve(job)));

vi.mock('@archipelia/engine', async (original) => ({
  ...(await original<object>()),
  readRuntime: () => Promise.resolve({ apVersion: engineAp.value }),
}));
vi.mock('../src/install/commit-install', () => ({ commitInstall: placed }));

const { carryWorlds } = await import('../src/install/carry-worlds');
const { reinstallFirstParty } = await import('../src/install/reinstall-first-party');

const at665 = worldBytes('ap 0.6.5');
const at667 = worldBytes('ap 0.6.7');

const manifest = buildsManifestOf([{ ap: '0.6.5', bytes: at665 }, { ap: '0.6.7', bytes: at667 }]);

const fetchFn = () => routed({
  [REGISTRY_URL]: () => json(registryOf('active', 'builds')),
  [MANIFEST_URL]: () => json(manifest),
  [buildUrl('0.6.5')]: () => bytesResponse(at665),
  [buildUrl('0.6.7')]: () => bytesResponse(at667),
  [buildBundleUrl('0.6.5')]: missing,
  [buildBundleUrl('0.6.7')]: missing,
  [BUNDLE_URL]: missing,
});

const reinstall = (engineDir: string) => reinstallFirstParty({
  engineDir, files: memoryFiles([]), cache: memoryFiles([]), apworld: 'relic_of_the_past', fetch: fetchFn(), trustRoot: () => Promise.resolve({} as never),
});

const runtime = (id: string): EngineRuntime => ({
  id, apVersion: '', apCommit: '', pythonVersion: '', root: id, python: '', generate: '', multiServer: '', schemaScript: '',
});

const firstPartyRecord = (): InstalledGame =>
  recordOf('relic_of_the_past', { source: 'first-party', version: '0.1.0', path: 'custom_worlds/relic_of_the_past.apworld' });

beforeEach(() => {
  engineAp.value = '0.6.7';
  placed.mockClear();
});

describe('an engine switch with an installed first-party world', () => {
  test('reinstalls the build for the version of the new engine', async () => {
    engineAp.value = '0.6.5';
    await reinstall('new-engine');
    const job = placed.mock.calls[0]?.[0] as { source: string; hash: { sha256: string } };
    expect(job.source).toBe('first-party');
    expect(job.hash.sha256).toBe(manifest.builds[0]?.sha256);
  });

  test('picks the other build for the other engine', async () => {
    await reinstall('new-engine');
    const job = placed.mock.calls[0]?.[0] as { hash: { sha256: string } };
    expect(job.hash.sha256).toBe(manifest.builds[1]?.sha256);
  });

  test('reports the game unavailable when the new engine has no build', async () => {
    engineAp.value = '0.6.9';
    await expect(reinstall('new-engine')).rejects.toThrow('No Relic of the Past build for Archipelago 0.6.9; builds exist for 0.6.5, 0.6.7');
    expect(placed).not.toHaveBeenCalled();
  });

  test('carryWorlds reinstalls it from the registry instead of copying the old file', async () => {
    const files = memoryFiles([firstPartyRecord()]);
    const reinstalled: string[] = [];
    const result = await carryWorlds({
      from: runtime('old'), to: runtime('new'), files, reinstall: () => Promise.resolve(),
      reinstallFirstParty: (apworld) => { reinstalled.push(apworld); return Promise.resolve(); },
    });
    expect(result).toMatchObject({ reinstalled: ['relic_of_the_past'], copied: [], problems: [] });
    expect(reinstalled).toEqual(['relic_of_the_past']);
  });

  test('carryWorlds lists a world with no build for the new engine as a problem', async () => {
    engineAp.value = '0.6.9';
    const result = await carryWorlds({
      from: runtime('old'), to: runtime('new'), files: memoryFiles([firstPartyRecord()]), reinstall: () => Promise.resolve(),
      reinstallFirstParty: () => reinstall('new-engine'),
    });
    expect(result.reinstalled).toEqual([]);
    expect(result.problems).toHaveLength(1);
    expect(result.problems[0]?.reason).toContain('No Relic of the Past build for Archipelago 0.6.9');
  });
});
