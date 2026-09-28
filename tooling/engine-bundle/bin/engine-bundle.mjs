#!/usr/bin/env node
/* @layer tooling-scripts @kind entry */
import { buildEngine } from '../src/index.mjs';

console.log(`engine ready: ${await buildEngine()}`);
