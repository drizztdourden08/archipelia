/* @layer renderer-app @kind config */
import type { BuildLogView } from '@archipelia/design';
import { MOCK_LOG } from '../mock-package-source.constants';

const NO_OP = () => undefined;

const NO_LOG: BuildLogView = { lines: [], label: undefined, progress: 0 };

const logOf = (label: string): BuildLogView => ({ lines: MOCK_LOG, label, progress: 0 });

export { logOf, NO_LOG, NO_OP };
