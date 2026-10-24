/* @layer renderer-app @kind logic */
import { openExternal, toast } from '@drizztdourden08/brock-react';
import { appApi } from '../../ipc/app-api';
import { useEngineStore } from '../../stores/useEngineStore';
import { finishInstall } from '../../views/EngineSettings/behavior/finish-install';
import type { EngineStartupDeps } from './engine-startup.type';

const engineStartupDeps = (): EngineStartupDeps => {
  const store = useEngineStore.getState();
  return {
    status: () => appApi().engineStatus(),
    startup: () => appApi().engineStartup(),
    overview: () => appApi().engineOverview(),
    offerShown: (version) => appApi().engineOfferShown(version),
    install: (choice) => store.install(choice),
    switchTo: (id) => store.switchTo(id),
    finish: finishInstall,
    tell: (sentence) => toast(sentence, { variant: 'danger' }),
    openNotes: openExternal,
  };
};

export { engineStartupDeps };
