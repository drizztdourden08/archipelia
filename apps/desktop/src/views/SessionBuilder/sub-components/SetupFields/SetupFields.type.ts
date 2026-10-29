/* @layer renderer-app @kind types */
import type { useSessionBuilder } from '../../behavior/useSessionBuilder';

type SetupFieldsProps = { builder: ReturnType<typeof useSessionBuilder>; onWorld: () => void };

export type { SetupFieldsProps };
