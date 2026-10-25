/* @layer renderer-app @kind types */
import type { useSessionBuilder } from '../../behavior/useSessionBuilder';

type BuilderSettingsProps = { builder: ReturnType<typeof useSessionBuilder> };

export type { BuilderSettingsProps };
