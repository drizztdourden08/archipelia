/* @layer tooling-scripts @kind logic */
import { spawn } from 'node:child_process';
import { win32 } from 'node:path';

const lineSink = (onLine) => {
  let rest = '';
  return (chunk) => {
    const parts = (rest + chunk.toString('utf8')).split(/\r?\n/);
    rest = parts.pop() ?? '';
    parts.filter((part) => part.length > 0).forEach(onLine);
  };
};

const run = (cmd, args, { cwd, env, onLine } = {}) =>
  new Promise((resolve, reject) => {
    const output = onLine ? 'pipe' : 'inherit';
    const child = spawn(cmd, args, { cwd, env: env ?? process.env, stdio: ['ignore', output, output], windowsHide: true });
    if (onLine) {
      child.stdout.on('data', lineSink(onLine));
      child.stderr.on('data', lineSink(onLine));
    }
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')}: exit ${code}`))));
  });

const tarBinary = () =>
  (process.platform === 'win32' ? win32.join(process.env.SystemRoot ?? 'C:/Windows', 'System32', 'tar.exe') : 'tar');

const extractTarGz = (archive, into, { strip = 0, onLine } = {}) =>
  run(tarBinary(), ['-xzf', archive, '-C', into, ...(strip ? [`--strip-components=${strip}`] : [])], { onLine });

export { extractTarGz, run };
