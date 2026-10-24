/* @layer renderer-app @kind types */
import type { VersionRowsInput } from '../../EngineSettings.type';

type VersionsSectionProps = Omit<VersionRowsInput, 'tag' | 'when'>;

export type { VersionsSectionProps };
