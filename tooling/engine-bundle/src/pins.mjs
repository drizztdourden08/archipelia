/* @layer tooling-scripts @kind logic */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const BUNDLE_DIR = join(import.meta.dirname, '..');

const readPins = async () => JSON.parse(await readFile(join(BUNDLE_DIR, 'engine-pins.json'), 'utf8'));

const pythonUrl = (pins, target) =>
  `https://github.com/astral-sh/python-build-standalone/releases/download/${pins.python.release}/${encodeURIComponent(target.file)}`;

const currentTarget = () => `${process.platform}-${process.arch}`;

export { BUNDLE_DIR, currentTarget, pythonUrl, readPins };
