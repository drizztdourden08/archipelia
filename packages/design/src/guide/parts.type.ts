/* @layer renderer-app @kind types */
import type {} from '@drizztdourden08/tessera';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    '@archipelia/design': {
      parts:
        | 'CommandConsole'
        | 'ConnectionStatus'
        | 'ErrorCallout'
        | 'GameCard'
        | 'GameDetails'
        | 'HintRow'
        | 'LogLines'
        | 'OptionControl'
        | 'OptionFieldRow'
        | 'PackageConsentDialog'
        | 'PackageSourceDialog'
        | 'PlayerStatusRow'
        | 'ServerOptionsForm'
        | 'SessionRow'
        | 'SessionStatusBar';
    };
  }
}
