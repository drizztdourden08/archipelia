#!/usr/bin/env node
/* @layer tooling-scripts @kind entry */
import { buildEngine, defaultSpec } from '../src/index.mjs';

console.log(`engine ready: ${await buildEngine({ spec: defaultSpec() })}`);
