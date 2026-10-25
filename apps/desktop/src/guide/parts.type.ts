/* @layer renderer-app @kind types */
import type {} from '@drizztdourden08/tessera';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    '@archipelia/desktop': {
      parts:
        | 'ArchipeliaServers'
        | 'DirectConnection'
        | 'EngineSettings'
        | 'GameStore'
        | 'HomeView'
        | 'HostChoice'
        | 'JoinSession'
        | 'LobbyMembers'
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
