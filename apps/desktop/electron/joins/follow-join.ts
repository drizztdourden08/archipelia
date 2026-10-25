/* @layer electron-main @kind logic */
import type { AdmissionMessage, ErrorMessage, LobbyFailed, LobbyProgress, LobbyStarted, LobbyState, RoomStatus, Welcome } from '@drizztdourden08/archipelia-lobby-protocol';
import { ENDING_CODES, TEXT } from './joins.constants';
import type { JoinRun, LinkMessage } from './joins.type';
import { fetchFiles } from './fetch-files';
import { resultsOf } from './results-of';
import { sendReady } from './send-ready';

const onAdmission = async (run: JoinRun, message: AdmissionMessage) => {
  if (message.state === 'pending') return;
  if (message.state === 'approved') {
    await run.save({ state: 'approved', message: undefined });
    sendReady(run);
    return;
  }
  await run.save({ state: 'refused', token: undefined, message: message.reason ?? TEXT.refused });
};

const onState = async (run: JoinRun, message: LobbyState) => {
  const me = message.members.find((member) => member.id === run.current().memberId);
  if (!me) return;
  if (me.ready) run.flags.readySent = true;
  const slot = me.slots.find((entry) => entry.name === run.current().slotName);
  if (slot && slot.state !== run.current().slotState) await run.save({ slotState: slot.state, message: slot.reason });
  sendReady(run);
};

const onStarted = async (run: JoinRun, message: LobbyStarted) => {
  const saved = await run.save({ state: 'started', message: undefined, results: resultsOf(run.current(), message) });
  const files = await fetchFiles(run, message);
  if (saved.results && files.length > 0) await run.save({ results: { ...saved.results, files } });
};

const onRoom = (run: JoinRun, message: RoomStatus) => {
  const { results } = run.current();
  const address = message.address ?? results?.address;
  return run.save({ message: message.state === 'stopped' ? TEXT.stopped : undefined, ...(results && address ? { results: { ...results, address } } : {}) });
};

const onError = (run: JoinRun, message: ErrorMessage) => {
  if (!message.fatal) return run.save({ message: message.message });
  const ending = ENDING_CODES.some((code) => code === message.code);
  const state = message.code === 'refused' ? 'refused' : 'ended';
  return run.save(ending ? { state, token: undefined, message: message.message } : { state: 'failed', message: message.message });
};

const onWelcome = (run: JoinRun, { member, lobby }: Welcome) =>
  run.save({ memberId: member.id, token: member.token, lobbyName: lobby.name, ap: lobby.engine.ap, state: member.admission === 'approved' ? 'approved' : 'pending', message: undefined });

const onLobby = (run: JoinRun, message: LobbyProgress | LobbyFailed) =>
  run.save({ message: message.type === 'lobby.failed' ? `${TEXT.failed}${message.message}` : TEXT.making });

const handle = (run: JoinRun, message: LinkMessage): Promise<unknown> => {
  switch (message.type) {
    case 'welcome': return onWelcome(run, message);
    case 'admission': return onAdmission(run, message);
    case 'lobby.state': return onState(run, message);
    case 'lobby.progress':
    case 'lobby.failed': return onLobby(run, message);
    case 'lobby.started': return onStarted(run, message);
    case 'room.status': return onRoom(run, message);
    case 'error': return onError(run, message);
    default: return Promise.resolve();
  }
};

const followJoin = (run: JoinRun) => (message: LinkMessage) => {
  void handle(run, message)
    .catch((error: unknown) => run.save({ message: error instanceof Error ? error.message : String(error) }))
    .catch(() => undefined);
};

export { followJoin };
