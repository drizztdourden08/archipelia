/* @layer renderer-app @kind types */
import type {} from '@drizztdourden08/tessera';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    '@archipelia/desktop': {
      parts:
        | 'EngineSettings'
        | 'GameStore'
        | 'HomeView'
        | 'OldRuns'
        | 'PresetEditor'
        | 'PresetsHub'
        | 'ServerManager'
        | 'SessionBuilder'
        | 'SessionDashboard'
        | 'SessionsLibrary';
    };
  }
}
