/* @layer core @kind logic */
import { RUSTUP_ROOT, RUSTUP_TRIPLES } from './tool.constants';
import type { ToolHost } from './tool.type';

const rustupUrlOf = ({ platform, arch }: Pick<ToolHost, 'platform' | 'arch'>): string | undefined => {
  const triple = RUSTUP_TRIPLES[`${platform}:${arch}`];
  return triple === undefined ? undefined : `${RUSTUP_ROOT}/${triple}/rustup-init${platform === 'win32' ? '.exe' : ''}`;
};

export { rustupUrlOf };
