/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { engineRequirements } from './requirements.mjs';
import { run } from './run.mjs';

const PIP_INSTALL = ['-m', 'pip', 'install', '--disable-pip-version-check', '--no-warn-script-location', '-r'];

const installRequirements = async ({ spec, out, python, onLine, onStep, signal }) => {
  onStep?.('requirements', 'Installing the Python requirements');
  const files = await engineRequirements(join(out, 'ap'), spec.requirements, join(out, 'requirements.engine.txt'));
  for (const file of files) await run(python, [...PIP_INSTALL, file], { onLine, signal });
};

export { installRequirements };
