/* @layer core @kind logic */
import { wheelIdsOf } from '../wheel/wheel-ids-of';
import type { PackageConsent } from '../install/package-consent.type';

const consentOf = ({ acceptPackages, wheels }: { acceptPackages?: PackageConsent | undefined; wheels?: unknown }) => ({
  ...(acceptPackages ? { packages: acceptPackages } : {}),
  ...(wheels ? { wheels: wheelIdsOf(wheels) } : {}),
});

export { consentOf };
