/* @layer renderer-app @kind types */
import type {} from '@drizztdourden08/tessera';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    '@archipelia/desktop': {
      parts:
        | 'ArchipeliaServers'
        | 'EngineSettings'
        | 'GameStore'
        | 'HomeView'
        | 'LobbyCreate'
        | 'LobbyDetail'
        | 'LobbyList'
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
