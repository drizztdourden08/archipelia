/* @layer renderer-app @kind logic */
import type { HostLogLine } from '@archipelia/hosts';
import type { LogRow } from '@drizztdourden08/tessera/composites';
import type { SentCommand } from '../SessionDashboard.type';
import { REPLY_WINDOW_MS } from '../SessionDashboard.constants';
import { clockOf } from './clock-of';
import { kindOf } from './kind-of';

const replyRow = (id: string, text: string): LogRow => {
  const failed = kindOf(text) === 'error';
  return { id, gutter: '', tag: failed ? 'error' : '', kind: failed ? 'error' : 'reply', message: text, indent: 1 };
};

const commandRows = (sent: SentCommand, replies: readonly HostLogLine[]): LogRow[] => [
  { id: `c${sent.id}`, gutter: clockOf(sent.at), tag: '', kind: 'command', message: `> ${sent.text}` },
  ...replies.map((line, i) => replyRow(`c${sent.id}-${i}`, line.text)),
  ...(sent.error ? [{ ...replyRow(`c${sent.id}-failed`, sent.error), tag: 'error', kind: 'error' }] : []),
];

const consoleRows = (sent: readonly SentCommand[], lines: readonly HostLogLine[], windowMs = REPLY_WINDOW_MS): LogRow[] => {
  const first = sent[0];
  if (!first) return [];
  const recent = lines.filter((line) => line.at >= first.at);
  return sent.flatMap((entry, i) => {
    const end = Math.min(sent[i + 1]?.at ?? Number.POSITIVE_INFINITY, entry.at + windowMs);
    return commandRows(entry, recent.filter((line) => line.at >= entry.at && line.at < end));
  });
};

export { consoleRows };
