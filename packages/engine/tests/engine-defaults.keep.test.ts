/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { compareVersions, ENGINE_DEFAULTS, engineId } from '../src';

describe('engine defaults', () => {
  test('the default Archipelago is a stable version at or above the supported floor', () => {
    expect(ENGINE_DEFAULTS.defaultAp.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(ENGINE_DEFAULTS.defaultAp.commit).toMatch(/^[0-9a-f]{40}$/);
    expect(compareVersions(ENGINE_DEFAULTS.defaultAp.version, ENGINE_DEFAULTS.minAp)).toBeGreaterThanOrEqual(0);
  });

  test.each(Object.entries(ENGINE_DEFAULTS.defaultPython))('the default Python for %s names its own file and checksum', (target, python) => {
    expect(python.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(python.file).toContain(`cpython-${python.version}+${python.release}-`);
    expect(target).toMatch(/^(win32|linux|darwin)-(x64|arm64)$/);
  });

  test('the default engine of each target has a safe folder name', () => {
    Object.entries(ENGINE_DEFAULTS.defaultPython).forEach(([target, python]) => {
      expect(engineId(ENGINE_DEFAULTS.defaultAp.version, python.version, target)).toMatch(/^ap-[\d.]+_py-[\d.]+_[a-z0-9-]+$/);
    });
  });
});
