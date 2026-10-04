/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import { HOST_LABEL } from '../HomeView.constants';
import { plural } from './plural';
import { relativeTime } from './relative-time';

const sessionMeta = (session: Session, now: number) =>
  `${HOST_LABEL[session.snapshot.host.kind]} · ${plural(session.snapshot.players.length, 'player')} · ${relativeTime(session.createdAt, now)}`;

export { sessionMeta };
