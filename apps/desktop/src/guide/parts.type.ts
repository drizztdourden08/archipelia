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
        | 'JoinSession'
        | 'LobbyMembers'
        | 'OldRuns'
        | 'PresetEditor'
        | 'PresetsHub'
        | 'ServerManager'
        | 'SessionBuilder'
        | 'SessionDashboard'
        | 'SessionLobby'
        | 'SessionsLibrary';
    };
  }
}
