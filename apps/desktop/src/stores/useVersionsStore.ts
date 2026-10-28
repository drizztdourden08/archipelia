/* @layer renderer-app @kind hook */
import type { VersionList } from '@archipelia/catalog';
import { appApi } from '../ipc/app-api';
import { createAskStore } from './create-ask-store';
import { UNREAD_VERSIONS } from './versions-store.constants';

const useVersionsStore = createAskStore<VersionList>({
  load: (request) => appApi().catalogVersions(request),
  failed: UNREAD_VERSIONS,
  again: (list) => list.problem !== undefined,
});

export { useVersionsStore };
