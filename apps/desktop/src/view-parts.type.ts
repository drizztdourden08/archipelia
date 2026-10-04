/* @layer renderer-app @kind types */
type DesktopView =
  | 'DataOverview' | 'EngineSettings' | 'GameStore' | 'HomeView' | 'LibraryExport' | 'LibraryImport'
  | 'OldRuns' | 'PresetEditor' | 'PresetsHub' | 'RunProgress' | 'ServerManager' | 'SessionBuilder' | 'SessionDashboard' | 'SessionsLibrary';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    archipeliaDesktop: { parts: DesktopView };
  }
}

export type { DesktopView };
