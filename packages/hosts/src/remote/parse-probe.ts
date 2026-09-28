/* @layer core @kind logic */
import type { HostProbe } from './host-probe.type';

const parseProbe = (stdout: string): HostProbe => {
  const values = new Map<string, string>();
  stdout.split(/\r?\n/).forEach((line) => {
    const at = line.indexOf('=');
    if (at > 0) values.set(line.slice(0, at), line.slice(at + 1).trim());
  });
  const read = (key: string) => values.get(key) ?? '';
  const port = read('port');
  return {
    apPath: read('ap'),
    python: read('python'),
    pythonVersion: read('pyver'),
    multiServer: read('multiserver') === 'yes',
    apVersion: read('apver'),
    systemd: read('systemd') === 'yes',
    linger: read('linger') === 'yes',
    portFree: port ? port === 'free' : undefined,
  };
};

export { parseProbe };
