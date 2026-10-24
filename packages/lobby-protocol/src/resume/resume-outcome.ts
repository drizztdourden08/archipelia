/* @layer protocol @kind logic */
import type { MemberAdmission } from '../protocol/protocol.type';
import type { ResumeOutcome } from './resume-outcome.type';

const resumeOutcome = (member: { admission: MemberAdmission; reason?: string } | null): ResumeOutcome => {
  if (member === null) {
    return {
      kind: 'error',
      failure: {
        code: 'resume-invalid',
        message: 'This lobby does not know this player. Join again with the lobby code.',
        field: 'resume',
      },
    };
  }
  if (member.admission === 'refused' || member.admission === 'removed') {
    const reason = member.reason === undefined ? '' : ` ${member.reason}`;
    return { kind: 'error', failure: { code: 'refused', message: `The host refused this player.${reason}` } };
  }
  return { kind: 'welcome', admission: member.admission };
};

export { resumeOutcome };
