/* @layer renderer-app @kind logic */
import { SKIPPED_SHOWN } from '../PresetEditor.constants';

const importSummary = (fileName: string, count: number, skipped: string[]) => {
  const head = `Imported ${count} options from ${fileName}.`;
  if (!skipped.length) return head;
  const shown = skipped.slice(0, SKIPPED_SHOWN).join(', ');
  const more = skipped.length > SKIPPED_SHOWN ? ` and ${skipped.length - SKIPPED_SHOWN} more` : '';
  return `${head} Skipped ${shown}${more}.`;
};

export { importSummary };
