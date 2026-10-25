/* @layer core @kind logic */
import type { PackageConsent } from './package-consent.type';
import { acceptText } from './accept-text';

const assertPackagesAccepted = (label: string, packages: string[], consent: PackageConsent = []) => {
  if (packages.length === 0 || consent === 'any') return;
  if (!packages.every((spec) => consent.includes(spec))) throw new Error(acceptText(label, packages));
};

export { assertPackagesAccepted };
