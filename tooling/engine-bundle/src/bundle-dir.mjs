/* @layer tooling-scripts @kind config */
import { join } from 'node:path';

const BUNDLE_DIR = join(import.meta.dirname, '..');

export { BUNDLE_DIR };
