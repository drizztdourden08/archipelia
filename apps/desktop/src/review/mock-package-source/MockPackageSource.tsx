/* @layer renderer-app @kind component */
import { PackageSourceDialog } from '@archipelia/design';
import { useMockWorld } from './behavior/useMockWorld';
import type { MockPackageSourceProps } from './MockPackageSource.type';

const MockPackageSource = ({ onClose }: MockPackageSourceProps) => <PackageSourceDialog {...useMockWorld(onClose)} />;

export { MockPackageSource };
