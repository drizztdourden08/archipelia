/* @layer core @kind logic */
import type { PackageConsent } from './package-consent.type';
import { acceptText } from './accept-text';
import { staleText } from './stale-text';

const sameSet = (left: string[], right: string[]) => left.length === right.length && left.every((pin) => right.includes(pin));

const assertPackagesAccepted = (label: string, pins: string[], sha256: string, consent?: PackageConsent) => {
  if (pins.length === 0) return;
  if (!consent) throw new Error(acceptText(label, pins));
  if (consent.sha256.toLowerCase() !== sha256.toLowerCase() || !sameSet(consent.packages, pins)) throw new Error(staleText(label));
};

export { assertPackagesAccepted };
