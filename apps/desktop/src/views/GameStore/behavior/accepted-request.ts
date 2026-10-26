/* @layer renderer-app @kind logic */
import type { InstallRequest, PackagePreview } from '@archipelia/catalog';

const acceptedRequest = (request: InstallRequest, { sha256, packages }: PackagePreview): InstallRequest =>
  (request.kind === 'official' ? request : { ...request, acceptPackages: { sha256, packages: packages.map((entry) => entry.pin) } });

export { acceptedRequest };
