/* @layer electron-main @kind types */
import type { createAppServices } from './app-services';

type AppServices = ReturnType<typeof createAppServices>;

export type { AppServices };
