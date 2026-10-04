/* @layer electron-main @kind types */
import type { AppServices } from '@drizztdourden08/brock-core/augment';
import type { createAppServices } from './app-services';

declare module '@drizztdourden08/brock-core/augment' {
  interface AppServices extends ReturnType<typeof createAppServices> {}
}

export type { AppServices };
