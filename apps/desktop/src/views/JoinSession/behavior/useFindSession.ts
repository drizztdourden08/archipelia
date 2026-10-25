/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';
import { failWith } from '../../../hooks/fail-with';
import { useLanServers } from '../../../hooks/useLanServers';
import { appApi } from '../../../ipc/app-api';
import { joinAddress } from '../../../lobbies/join-address';
import type { LanEntry, LobbyProbe } from '../../../lobbies/lobbies.type';
import { FAILURE } from '../JoinSession.constants';

const useFindSession = () => {
  const [looking, setLooking] = useState(false);
  const [address, setAddress] = useState('');
  const [code, setCode] = useState('');
  const [probe, setProbe] = useState<LobbyProbe | null>(null);
  const { guard, isBusy, errorOf } = useKeyedGuard();
  const servers = useLanServers(looking);

  const others = useMemo(() => servers.filter((server) => !server.self), [servers]);
  const parsed = address.trim() === '' ? null : joinAddress(address);
  const addressProblem = parsed && 'problem' in parsed ? parsed.problem : null;

  const edit = useCallback((change: () => void) => {
    setProbe(null);
    change();
  }, []);

  const check = () => guard('probe', failWith(FAILURE.probe, async () => { setProbe(await appApi().lobbyProbe(address, code)); }));

  return {
    looking, toggleLooking: () => setLooking((now) => !now),
    servers: others,
    address, code, probe, addressProblem,
    setAddress: (value: string) => edit(() => setAddress(value)),
    setCode: (value: string) => edit(() => setCode(value)),
    pick: (server: LanEntry) => edit(() => setAddress(`${server.host}:${server.port}`)),
    canCheck: address.trim() !== '' && code.trim() !== '' && addressProblem === null,
    check,
    checking: isBusy('probe'),
    error: errorOf('probe'),
  };
};

export { useFindSession };
