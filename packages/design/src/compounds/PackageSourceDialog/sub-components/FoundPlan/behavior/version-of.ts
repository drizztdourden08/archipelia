/* @layer renderer-app @kind logic */
import type { SourcePlan } from '@archipelia/model';

const versionOf = ({ pin }: SourcePlan): { version: string; date: string | undefined } => {
  const short = pin.sha.slice(0, 7);
  return { version: pin.kind === 'tag' ? `${pin.ref} (${short})` : short, date: pin.date ? new Date(pin.date).toLocaleDateString() : undefined };
};

export { versionOf };
