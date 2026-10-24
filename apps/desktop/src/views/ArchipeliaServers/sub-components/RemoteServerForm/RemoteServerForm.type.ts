/* @layer renderer-app @kind types */
import type { ServerDraft } from '../../ArchipeliaServers.type';

type RemoteServerFormProps = { onAdd: (draft: ServerDraft) => Promise<boolean>; onClose: () => void };

export type { RemoteServerFormProps };
