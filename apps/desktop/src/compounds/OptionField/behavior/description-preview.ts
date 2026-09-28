/* @layer renderer-app @kind logic */
import type { DescriptionPreview } from '../OptionField.type';
import { PREVIEW_CHARS, PREVIEW_LINES } from '../OptionField.constants';

const descriptionPreview = (text: string): DescriptionPreview => {
  const trimmed = text.trim();
  const lines = trimmed.split('\n');
  if (trimmed.length <= PREVIEW_CHARS && lines.length <= PREVIEW_LINES) return { preview: trimmed, long: false };
  const head = lines.slice(0, PREVIEW_LINES).join('\n');
  const cut = head.length > PREVIEW_CHARS ? head.slice(0, PREVIEW_CHARS).replace(/\s+\S*$/, '') : head;
  return { preview: `${cut.trimEnd()}...`, long: true };
};

export { descriptionPreview };
