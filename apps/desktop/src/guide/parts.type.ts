/* @layer renderer-app @kind types */
import type {} from '@drizztdourden08/tessera';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    '@archipelia/desktop': {
      parts:
        | 'ArchipeliaServers'
        | 'EngineSettings'
        | 'GameStore'
        | 'History'
        | 'HomeView'
        | 'JoinSession'
        | 'LobbyMembers'
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
