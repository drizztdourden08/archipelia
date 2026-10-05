/* @layer renderer-app @kind types */
import type { ServerEntry } from '@archipelia/model';
import type { useServerManager } from '../../behavior/useServerManager';

type ServerEditorProps = { draft: ServerEntry; manager: ReturnType<typeof useServerManager> };

export type { ServerEditorProps };
