/* @layer tooling-scripts @kind logic */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { downloadTo, exists } from './download.mjs';
import { OFFICIAL_DIR, packOfficial } from './official/pack-official.mjs';
import { BUNDLE_DIR, currentTarget, pythonUrl, readPins } from './pins.mjs';
import { engineRequirements } from './requirements.mjs';
import { extractTarGz, run } from './run.mjs';
import { installSchemaScript } from './schema-script.mjs';

const PIP_INSTALL = ['-m', 'pip', 'install', '--disable-pip-version-check', '--no-warn-script-location', '-r'];
const BASE_STAMP = 'base.done';
const BASE_STEPS = ['python', 'archipelago', 'requirements'];

const unpack = async ({ pins, py, out, downloads, onLine, onStep }) => {
  onStep?.('python', `Downloading Python ${pins.python.version}`);
  onLine?.(`Downloading Python ${pins.python.version}`);
  await extractTarGz(await downloadTo(pythonUrl(pins, py), join(downloads, py.file), py.sha256), out, { onLine });
  onStep?.('archipelago', `Downloading Archipelago ${pins.ap.version}`);
  onLine?.(`Downloading Archipelago ${pins.ap.version}`);
  await extractTarGz(await downloadTo(pins.ap.url, join(downloads, `ap-${pins.ap.commit}.tar.gz`)), join(out, 'ap'), { strip: 1, onLine });
};

const installRequirements = async ({ pins, out, python, onLine, onStep }) => {
  onStep?.('requirements', 'Installing the Python requirements');
  const pinned = { skip: pins.skipRequirements, extra: pins.extraRequirements };
  const files = await engineRequirements(join(out, 'ap'), pinned, join(out, 'requirements.engine.txt'));
  for (const file of files) await run(python, [...PIP_INSTALL, file], { onLine });
};

const buildBase = async ({ pins, py, out, downloads, python, onLine, onStep }) => {
  await rm(out, { recursive: true, force: true });
  await mkdir(join(out, 'ap'), { recursive: true });
  await unpack({ pins, py, out, downloads, onLine, onStep });
  await installRequirements({ pins, out, python: join(out, python), onLine, onStep });
  await writeFile(join(out, BASE_STAMP), '', 'utf8');
};

const buildEngine = async ({ buildDir = join(BUNDLE_DIR, 'dist'), onLine, onStep, onSkip } = {}) => {
  const pins = await readPins();
  const target = currentTarget();
  const py = pins.python.targets[target];
  if (!py) throw new Error(`no Python pin for ${target}`);
  const out = join(buildDir, `${pins.ap.version}-${target}`);
  const stamp = join(out, 'engine.json');
  const python = process.platform === 'win32' ? 'python/python.exe' : 'python/bin/python3';
  const built = (await exists(join(out, BASE_STAMP))) || (await exists(stamp));
  if (built) BASE_STEPS.forEach((step) => onSkip?.(step));
  else await buildBase({ pins, py, out, downloads: join(buildDir, 'downloads'), python, onLine, onStep });
  const schemaScript = await installSchemaScript(out);
  onStep?.('official', 'Packing the official worlds');
  onLine?.('Packing the official worlds');
  await packOfficial({ out, python, onLine });
  const runtime = {
    apVersion: pins.ap.version,
    root: '.',
    python,
    generate: 'ap/Generate.py',
    multiServer: 'ap/MultiServer.py',
    schemaScript,
    official: OFFICIAL_DIR,
  };
  await writeFile(stamp, JSON.stringify(runtime, null, 2), 'utf8');
  return stamp;
};

export { buildEngine };
