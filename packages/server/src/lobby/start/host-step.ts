/* @layer core @kind logic */
import type { HostTarget } from '@archipelia/model';

const hostStep = (target: HostTarget): string => (target.kind === 'local' ? 'start-room' : 'upload-room');

export { hostStep };
