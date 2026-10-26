/* @layer tests @kind test */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test, vi } from 'vitest';
import { archiveOf, PROJECT_FILES } from './build.fixtures';

vi.mock('@archipelia/engine', async () => (await import('./build-engine.fixtures')).mockedEngine());

const { bed, registerBuildBed } = await import('./build-bed.fixtures');

registerBuildBed();

const NONE = '00000000-0000-4000-8000-000000000000';

describe('what the consent is bound to', () => {
  test('a consent for another archive checksum is refused, nothing is unpacked and no tool is installed', async () => {
    const { prepared, requestOf, builds, calls } = bed();
    const refused = await builds.build(requestOf(await prepared(), { archiveSha256: 'f'.repeat(64) }));
    expect(refused).toMatchObject({ status: 'failed' });
    expect(JSON.stringify(refused)).toContain('changed since you reviewed');
    expect(calls.map((call) => call.job)).toEqual(['venv']);
  });

  const otherTools = [['setuptools==99.0.0', 'wheel==0.45.1'], ['setuptools==80.1.0'], [], ['setuptools==80.1.0', 'wheel==0.45.1', 'evil==1.0']];

  test.each(otherTools.map((tools) => [tools]))('a consent for the build tools %j is refused', async (tools) => {
    const { prepared, requestOf, builds, calls } = bed();
    const refused = await builds.build(requestOf(await prepared(), { tools }));
    expect(JSON.stringify(refused)).toContain('changed since you reviewed');
    expect(calls.map((call) => call.job)).toEqual(['venv']);
  });

  test('a source archive that changed on disk after it was shown is refused before it is unpacked', async () => {
    const { prepared, requestOf, builds, calls, workOf } = bed();
    const plan = await prepared();
    await writeFile(join(workOf(), 'source.zip'), archiveOf({ ...PROJECT_FILES, 'setup.py': 'import os\nos.system("evil")\n' }));
    const refused = await builds.build(requestOf(plan));
    expect(JSON.stringify(refused)).toContain('changed on disk');
    expect(calls.map((call) => call.job)).toEqual(['venv']);
  });

  test('a build id that was not prepared, or was already used, starts nothing', async () => {
    const { prepared, requestOf, builds, calls } = bed();
    await expect(builds.build({ buildId: NONE, archiveSha256: 'a'.repeat(64), tools: [] })).rejects.toThrow('no build to continue');
    const plan = await prepared();
    expect((await builds.build(requestOf(plan))).status).toBe('built');
    await expect(builds.build(requestOf(plan))).rejects.toThrow('no build to continue');
    expect(calls.map((call) => call.job)).toEqual(['venv', 'tools', 'wheel']);
  });

  test('a process step starts only for the build and the phase it belongs to', async () => {
    const { prepared, builds } = bed();
    const plan = await prepared();
    await expect(builds.specOf('wheel', { buildId: plan.buildId })).rejects.toThrow('no build to continue');
    await expect(builds.specOf('tools', { buildId: plan.buildId })).rejects.toThrow('no build to continue');
    await expect(builds.specOf('venv', { buildId: NONE })).rejects.toThrow('no build to continue');
    await expect(builds.specOf('venv', { buildId: 'not an id' })).rejects.toThrow('not valid');
    await expect(builds.specOf('venv', undefined)).rejects.toThrow('not valid');
    await builds.dispose();
  });
});
