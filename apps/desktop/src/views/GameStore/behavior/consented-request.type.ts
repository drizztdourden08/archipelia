/* @layer renderer-app @kind types */
import type { InstallRequest, PackagePreview } from '@archipelia/catalog';
import type { ConsentPackage } from '@archipelia/design';

type ConsentParams = {
  request: InstallRequest;
  title: string;
  preview: (request: InstallRequest) => Promise<PackagePreview>;
  ask: (title: string, packages: readonly ConsentPackage[]) => Promise<boolean>;
};

export type { ConsentParams };
