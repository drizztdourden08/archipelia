/* @layer renderer-app @kind types */
import type { InstallRequest, PackagePreview } from '@archipelia/catalog';
import type { AskConsent } from './useConsent.type';

type ConsentParams = {
  request: InstallRequest;
  title: string;
  preview: (request: InstallRequest) => Promise<PackagePreview>;
  ask: AskConsent;
};

export type { ConsentParams };
