/* @layer core @kind logic */
import { join } from 'node:path';
import { RUST_FOLDERS } from './tool.constants';
import type { RustHomes } from './rust-homes.type';

const rustHomesOf = (toolsDir: string): RustHomes => ({ cargo: join(toolsDir, RUST_FOLDERS.cargo), rustup: join(toolsDir, RUST_FOLDERS.rustup) });

export { rustHomesOf };
