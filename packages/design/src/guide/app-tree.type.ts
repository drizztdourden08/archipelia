/* @layer renderer-app @kind types */
import type { APP_TREE } from './app-tree.constants';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    archipeliaDesign: { tree: typeof APP_TREE };
  }
}
