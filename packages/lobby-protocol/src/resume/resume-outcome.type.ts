/* @layer protocol @kind types */
import type { Failure, MemberAdmission } from '../protocol/protocol.type';

type ResumeOutcome = { kind: 'welcome'; admission: MemberAdmission } | { kind: 'error'; failure: Failure };

export type { ResumeOutcome };
