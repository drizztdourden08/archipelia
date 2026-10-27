/* @layer renderer-app @kind logic */
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { isRecord } from '@archipelia/model';

const tabIdOf = ({ data }: ContextMenuContext): string | undefined => (isRecord(data) && typeof data.tabId === 'string' ? data.tabId : undefined);

export { tabIdOf };
