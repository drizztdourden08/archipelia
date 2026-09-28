/* @layer core @kind logic */
import type { ServerCheck } from '@archipelia/model';
import type { HostProbe } from './host-probe.type';
import { PYTHON_MAX, PYTHON_MIN } from './probe-checks.constants';

const pythonCheck = ({ python, pythonVersion }: HostProbe): ServerCheck => {
  if (!python) return { name: 'python', ok: false, detail: 'python3 was not found' };
  const [major, minor = 0] = pythonVersion.split('.').map(Number);
  const ok = major === 3 && minor >= PYTHON_MIN && minor <= PYTHON_MAX;
  const detail = `${python} is ${pythonVersion || 'an unknown version'}`;
  return { name: 'python', ok, detail: ok ? detail : `${detail}, Archipelago needs 3.${PYTHON_MIN} to 3.${PYTHON_MAX}` };
};

const probeChecks = (probe: HostProbe, apVersion: string, gamePort: number): ServerCheck[] => [
  pythonCheck(probe),
  { name: 'multiserver', ok: probe.multiServer, detail: probe.multiServer ? `${probe.apPath}/MultiServer.py found` : `no MultiServer.py in ${probe.apPath}` },
  {
    name: 'ap-version',
    ok: probe.apVersion === apVersion,
    detail: probe.apVersion ? `Archipelago ${probe.apVersion}, this app runs ${apVersion}` : `no version found in ${probe.apPath}/Utils.py`,
  },
  {
    name: 'game-port',
    ok: probe.portFree === true,
    detail: probe.portFree === undefined ? `port ${gamePort} could not be checked` : `port ${gamePort} is ${probe.portFree ? 'free' : 'in use'}`,
  },
  {
    name: 'linger',
    ok: probe.linger,
    advisory: true,
    detail: probe.linger && probe.systemd
      ? 'lingering is on, the server runs as a systemd user unit'
      : 'lingering is off or systemd is missing, the server runs under nohup setsid',
  },
];

export { probeChecks };
