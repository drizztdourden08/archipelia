/* @layer renderer-app @kind types */
import type { DirectWorld } from '../../SessionBuilder.type';

type DirectWorldsProps = { worlds: readonly DirectWorld[]; allowUnlisted: boolean };

export type { DirectWorldsProps };
