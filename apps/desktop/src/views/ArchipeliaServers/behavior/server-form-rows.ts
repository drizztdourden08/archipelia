/* @layer renderer-app @kind logic */
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { FORM_TEXT } from '../ArchipeliaServers.constants';
import type { DraftProblem, ServerDraft } from '../ArchipeliaServers.type';

const serverFormRows = (draft: ServerDraft, problems: readonly DraftProblem[], onDraft: (draft: ServerDraft) => void): SettingsSectionRow[] => {
  const problem = (field: DraftProblem['field']) => problems.find((entry) => entry.field === field)?.message;
  return [
    { id: 'label', ...FORM_TEXT.label, problem: problem('label'), input: { kind: 'text', value: draft.label, onChange: (label) => onDraft({ ...draft, label }) } },
    { id: 'url', ...FORM_TEXT.url, problem: problem('url'), input: { kind: 'text', value: draft.url, placeholder: 'wss://host:38290', onChange: (url) => onDraft({ ...draft, url }) } },
    { id: 'token', ...FORM_TEXT.token, problem: problem('token'), input: { kind: 'password', value: draft.token, onChange: (token) => onDraft({ ...draft, token }) } },
    { id: 'pin', ...FORM_TEXT.pin, problem: problem('pin'), input: { kind: 'text', value: draft.pin, onChange: (pin) => onDraft({ ...draft, pin }) } },
  ];
};

export { serverFormRows };
