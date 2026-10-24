/* @layer server @kind entry */
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const file = fileURLToPath(import.meta.url);
Object.assign(globalThis, { __filename: file, __dirname: dirname(file), require: createRequire(import.meta.url) });
