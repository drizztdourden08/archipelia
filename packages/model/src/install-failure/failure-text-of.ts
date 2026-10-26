/* @layer core @kind logic */
import { decodeInstallFailure } from './decode-install-failure';

const failureTextOf = (wire: string): string => decodeInstallFailure(wire)?.message ?? wire;

export { failureTextOf };
