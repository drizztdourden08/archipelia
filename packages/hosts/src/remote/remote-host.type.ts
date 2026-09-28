/* @layer core @kind types */
import type { RemoteLayout } from './remote-layout.type';
import type { StreamHandle } from './remote.type';

type Run = { layout: RemoteLayout; systemd: boolean; tail?: StreamHandle };

export type { Run };
