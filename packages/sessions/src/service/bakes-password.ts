/* @layer core @kind logic */
import type { HostTarget } from '@archipelia/model';

const bakesPassword = (target: HostTarget) => target.kind === 'archipelago-gg';

export { bakesPassword };
