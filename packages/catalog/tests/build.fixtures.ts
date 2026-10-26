/* @layer tests @kind fixture */
import { strToU8, zipSync } from 'fflate';
import type { SourcePlan } from '@archipelia/model';

const COMMIT = 'a'.repeat(40);

const SOURCE_URL = `https://codeload.github.com/Pseudoarc/ctrando/zip/${COMMIT}`;

const PYPROJECT = '[build-system]\nrequires = ["setuptools>=61", "wheel"]\nbuild-backend = "setuptools.build_meta"\n';

const PLAN: SourcePlan = {
  owner: 'Pseudoarc',
  repo: 'ctrando',
  url: 'https://github.com/Pseudoarc/ctrando',
  module: 'ctrando',
  pin: { kind: 'head', ref: 'main', sha: COMMIT },
  python: 'python',
  command: '',
  native: true,
  submodules: false,
  unsure: false,
  projectName: 'ctrando',
  wheelState: 'none',
};

const TOP = `ctrando-${COMMIT}`;

const archiveOf = (files: Record<string, string>, top = TOP): Uint8Array =>
  zipSync({ [`${top}/`]: new Uint8Array(), ...Object.fromEntries(Object.entries(files).map(([name, body]) => [`${top}/${name}`, strToU8(body)])) });

const rawArchive = (entries: Record<string, string>): Uint8Array => zipSync(Object.fromEntries(Object.entries(entries).map(([name, body]) => [name, strToU8(body)])));

const PROJECT_FILES = { 'pyproject.toml': PYPROJECT, 'src/ctrando/__init__.py': '', 'src/ctrando/compression/compress.c': 'int main(void){return 0;}' };

const WHEEL = 'ctrando-1.2.0-cp312-cp312-win_amd64.whl';

const TOOLS = [
  { name: 'setuptools', version: '80.1.0', pin: 'setuptools==80.1.0', sha256: 'a'.repeat(64), url: 'https://pypi.org/project/setuptools/80.1.0/', direct: true },
  { name: 'wheel', version: '0.45.1', pin: 'wheel==0.45.1', sha256: 'b'.repeat(64), url: 'https://pypi.org/project/wheel/0.45.1/', direct: true },
];

export { archiveOf, COMMIT, PLAN, PROJECT_FILES, rawArchive, SOURCE_URL, TOOLS, TOP, WHEEL };
