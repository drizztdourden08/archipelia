/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import ENGINE_PINS from '../engine-pins.json' with { type: 'json' };

const BUNDLE_DIR = join(import.meta.dirname, '..');

const readPins = async () => ENGINE_PINS;

const pythonUrl = (pins, target) =>
  `https://github.com/astral-sh/python-build-standalone/releases/download/${pins.python.release}/${encodeURIComponent(target.file)}`;

const currentTarget = () => `${process.platform}-${process.arch}`;

export { BUNDLE_DIR, currentTarget, pythonUrl, readPins };
