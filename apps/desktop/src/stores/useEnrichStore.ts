/* @layer renderer-app @kind hook */
import type { GameEnrichment } from '@archipelia/catalog';
import { appApi } from '../ipc/app-api';
import { createAskStore } from './create-ask-store';

const useEnrichStore = createAskStore<GameEnrichment>({ load: (request) => appApi().catalogEnrich(request) });

export { useEnrichStore };
