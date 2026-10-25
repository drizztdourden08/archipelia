/* @layer electron-main @kind logic */
import type { JoinRun } from './joins.type';

const sendReady = (run: JoinRun) => {
  if (!run.flags.uploaded || run.flags.readySent || run.current().state !== 'approved') return;
  run.flags.readySent = true;
  run.link.send({ type: 'ready', ready: true });
};

export { sendReady };
