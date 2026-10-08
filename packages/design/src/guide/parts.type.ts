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
        | 'HintRow'
        | 'LogLines'
        | 'OptionControl'
        | 'OptionFieldRow'
        | 'PlayerStatusRow'
        | 'RunRow'
        | 'ServerOptionsForm'
        | 'SessionRow'
        | 'SessionStatusBar';
    };
  }
}
