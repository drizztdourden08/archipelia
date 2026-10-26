/* @layer core @kind logic */
import { sameSources } from '../wheel/same-sources';
import { wheelLabel } from '../wheel/wheel-label';
import type { AcceptedFound } from './assert-packages-accepted.type';
import type { PackageConsent } from './package-consent.type';
import { acceptText } from './accept-text';
import { staleText } from './stale-text';

const sameSet = (left: string[], right: string[]) => left.length === right.length && left.every((pin) => right.includes(pin));

const assertPackagesAccepted = (label: string, { pins, sha256, sources = [] }: AcceptedFound, consent?: PackageConsent) => {
  if (pins.length === 0 && sources.length === 0) return;
  if (!consent) throw new Error(acceptText(label, [...sources.map(wheelLabel), ...pins]));
  if (consent.sha256.toLowerCase() !== sha256.toLowerCase() || !sameSet(consent.packages, pins) || !sameSources(consent.sources ?? [], sources)) {
    throw new Error(staleText(label));
  }
};

export { assertPackagesAccepted };
