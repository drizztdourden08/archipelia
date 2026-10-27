/* @layer core @kind logic */
import type { ResolvedPackage } from '@archipelia/engine';
import { RUST_BACKENDS } from './build.constants';

const rustProjectOf = (pins: readonly ResolvedPackage[], cargoToml: string | undefined): boolean =>
  cargoToml !== undefined || pins.some((pin) => RUST_BACKENDS.includes(pin.name.toLowerCase().replaceAll('_', '-')));

export { rustProjectOf };
