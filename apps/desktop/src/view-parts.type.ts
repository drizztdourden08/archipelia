/* @layer renderer-app @kind types */
type DesktopView =
  | 'DataOverview' | 'EngineSettings' | 'GameStore' | 'GgSettings' | 'HomeView' | 'LibraryExport' | 'LibraryImport' | 'NumberSetting'
  | 'OldRuns' | 'PresetEditor' | 'PresetsHub' | 'RunProgress' | 'ServerManager' | 'SessionBuilder' | 'SessionDashboard' | 'SessionsLibrary';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    archipeliaDesktop: { parts: DesktopView };
  }
}

export type { DesktopView };
