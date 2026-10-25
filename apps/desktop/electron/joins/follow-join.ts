/* @layer electron-main @kind logic */
import type { AdmissionMessage, ErrorMessage, LobbyFailed, LobbyProgress, LobbyStarted, LobbyState, RoomStatus, Welcome } from '@drizztdourden08/archipelia-lobby-protocol';
import { ENDING_CODES, TEXT } from './joins.constants';
import type { JoinHandlers, JoinRun, LinkMessage } from './joins.type';
import { fetchFiles } from './fetch-files';
import { resultsOf } from './results-of';
import { sendReady } from './send-ready';

const onAdmission = async (run: JoinRun, message: AdmissionMessage) => {
  if (message.state === 'pending') return;
  if (message.state === 'approved') {
    await run.save({ state: 'approved', admission: 'approved', message: undefined });
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
  const before = run.current().results;
  const fresh = resultsOf(run.current(), message);
  const fetched = before?.seed === fresh.seed && before.files.some((file) => file.saved !== undefined || file.refused !== undefined);
  await run.save({ state: 'started', message: undefined, results: fetched ? { ...fresh, files: before.files } : fresh });
  if (fetched || run.flags.fetching) return;
  run.flags.fetching = true;
  const files = await fetchFiles(run, message);
  await run.save({ results: { ...(run.current().results ?? fresh), files } });
};

const onRoom = (run: JoinRun, message: RoomStatus) => {
  const { results } = run.current();
  const address = message.address ?? results?.address;
  return run.save({ message: message.state === 'stopped' ? TEXT.stopped : undefined, ...(results && address ? { results: { ...results, address } } : {}) });
};

const onError = (run: JoinRun, message: ErrorMessage) => {
  if (message.code === 'slot-name-taken') {
    const saved = run.save({ state: 'failed', token: undefined, message: `${message.message} ${TEXT.pickAnotherName}` });
    run.link.send({ type: 'leave' });
    run.link.close();
    return saved;
  }
  if (!message.fatal) return run.save({ message: message.message });
  const ending = ENDING_CODES.some((code) => code === message.code);
  const state = message.code === 'refused' ? 'refused' : 'ended';
  return run.save(ending ? { state, token: undefined, message: message.message } : { state: 'failed', message: message.message });
};

const onWelcome = (run: JoinRun, { member, lobby }: Welcome) =>
  run.save({
    memberId: member.id, token: member.token, lobbyName: lobby.name, ap: lobby.engine.ap, message: undefined,
    state: member.admission === 'approved' ? 'approved' : 'pending', admission: member.admission === 'approved' ? 'approved' : 'pending',
  });

const onLobby = (run: JoinRun, message: LobbyProgress | LobbyFailed) =>
  run.save({ message: message.type === 'lobby.failed' ? `${TEXT.failed}${message.message}` : TEXT.making });

const handlers: JoinHandlers = {
  welcome: onWelcome,
  admission: onAdmission,
  'lobby.state': onState,
  'lobby.progress': onLobby,
  'lobby.failed': onLobby,
  'lobby.started': onStarted,
  'room.status': onRoom,
  error: onError,
};

const handle = (run: JoinRun, message: LinkMessage): Promise<unknown> => {
  const handler = handlers[message.type] as ((run: JoinRun, message: LinkMessage) => Promise<unknown>) | undefined;
  return handler ? handler(run, message) : Promise.resolve();
};

const followJoin = (run: JoinRun) => (message: LinkMessage) => {
  void handle(run, message)
    .catch((error: unknown) => run.save({ message: error instanceof Error ? error.message : String(error) }))
    .catch(() => undefined);
};

export { followJoin };
