/* @layer tests @kind types */
import type { LaunchedTestApp } from '@drizztdourden08/brock-build/testing';

type LaunchedApp = LaunchedTestApp & { proofDir: string };

export type { LaunchedApp };
