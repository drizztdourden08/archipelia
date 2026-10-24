/* @layer tooling-scripts @kind logic */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BUNDLE_DIR } from './bundle-dir.mjs';
import { exists } from './download.mjs';
import { freezePackages } from './freeze-packages.mjs';
import { installRequirements } from './install-requirements.mjs';
import { OFFICIAL_DIR, packOfficial } from './official/pack-official.mjs';
import { installSchemaScript } from './schema-script.mjs';
import { unpackEngine } from './unpack-engine.mjs';
import { writeManifest } from './write-manifest.mjs';

const BASE_STAMP = 'base.done';
const BASE_STEPS = ['python', 'archipelago', 'requirements'];
const REMOVE_OPTIONS = { recursive: true, force: true, maxRetries: 5, retryDelay: 200 };

const buildBase = async ({ spec, out, downloads, python, verifySource, onLine, onStep, signal }) => {
  await rm(out, REMOVE_OPTIONS);
  await mkdir(join(out, 'ap'), { recursive: true });
  await unpackEngine({ spec, out, downloads, onLine, onStep, signal });
  const warning = await verifySource?.(join(out, 'ap'));
  if (warning) onLine?.(warning);
  signal?.throwIfAborted();
  await installRequirements({ spec, out, python: join(out, python), onLine, onStep, signal });
  await writeFile(join(out, BASE_STAMP), '', 'utf8');
};

const assembleEngine = async ({ spec, out, python, stamp, onLine, onStep, signal }) => {
  const schemaScript = await installSchemaScript(out);
  signal?.throwIfAborted();
  onStep?.('official', 'Packing the official worlds');
  onLine?.('Packing the official worlds');
  await packOfficial({ out, python, onLine });
  signal?.throwIfAborted();
  const packages = await freezePackages(join(out, python), signal);
  return writeManifest(stamp, {
    id: spec.id,
    apVersion: spec.ap.version,
    apCommit: spec.ap.commit,
    pythonVersion: spec.python.version,
    pythonRelease: spec.python.release,
    target: spec.target,
    builtAt: Date.now(),
    root: '.',
    python,
    generate: 'ap/Generate.py',
    multiServer: 'ap/MultiServer.py',
    schemaScript,
    official: OFFICIAL_DIR,
    rules: spec.requirements.rules,
    packages,
  });
};

const buildEngine = async ({ buildDir = join(BUNDLE_DIR, 'dist'), spec, verifySource, onLine, onStep, onSkip, signal } = {}) => {
  if (!spec) throw new Error('buildEngine needs a spec');
  const out = join(buildDir, spec.id);
  const stamp = join(out, 'engine.json');
  const python = process.platform === 'win32' ? 'python/python.exe' : 'python/bin/python3';
  const hadEngine = await exists(stamp);
  const built = hadEngine || (await exists(join(out, BASE_STAMP)));
  try {
    signal?.throwIfAborted();
    if (built) BASE_STEPS.forEach((step) => onSkip?.(step));
    else await buildBase({ spec, out, downloads: join(buildDir, 'downloads'), python, verifySource, onLine, onStep, signal });
    return await assembleEngine({ spec, out, python, stamp, onLine, onStep, signal });
  } catch (err) {
    if (!hadEngine) await rm(out, REMOVE_OPTIONS);
    throw err;
  }
};

export { buildEngine };
