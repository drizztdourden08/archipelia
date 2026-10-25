/* @layer renderer-app @kind logic */
import { SHORT_DESCRIPTION } from './help-of.constants';

const helpOf = (description: string): string | undefined => {
  const text = description.trim();
  return text.length > SHORT_DESCRIPTION || text.includes('\n') ? text : undefined;
};

export { helpOf };
