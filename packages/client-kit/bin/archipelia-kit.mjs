#!/usr/bin/env node
/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { registerHooks, stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';

const RELATIVE = /^\.{1,2}\//;
const HAS_EXTENSION = /\.[cm]?[jt]s$/;
const built = new URL('../dist/cli.js', import.meta.url);

const runSource = async () => {
  const emitWarning = process.emitWarning.bind(process);
  process.emitWarning = (warning, ...rest) => {
    if (String(warning).includes('stripTypeScriptTypes')) return;
    emitWarning(warning, ...rest);
  };
  registerHooks({
    resolve(specifier, context, next) {
      if (!RELATIVE.test(specifier) || HAS_EXTENSION.test(specifier)) return next(specifier, context);
      for (const suffix of ['.ts', '/index.ts']) {
        try {
          return next(`${specifier}${suffix}`, context);
        } catch {
          continue;
        }
      }
      return next(specifier, context);
    },
    load(url, context, next) {
      if (!url.startsWith('file:') || !url.endsWith('.ts')) return next(url, context);
      const source = stripTypeScriptTypes(readFileSync(fileURLToPath(url), 'utf8'), { mode: 'strip' });
      return { format: 'module', source, shortCircuit: true };
    },
  });
  await import('../src/cli/main.ts');
};

if (existsSync(fileURLToPath(built))) await import(built.href);
else await runSource();
