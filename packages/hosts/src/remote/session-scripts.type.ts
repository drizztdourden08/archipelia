/* @layer core @kind types */
import type { RemoteLayout } from './remote-layout.type';

type LaunchPlan = { layout: RemoteLayout; python: string; args: string[]; systemd: boolean };

export type { LaunchPlan };
