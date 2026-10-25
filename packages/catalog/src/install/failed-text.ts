/* @layer core @kind logic */
import { packagePlural } from './package-plural';

const failedText = (label: string, names: string[], reason: string) =>
  `${label} needs the Python ${packagePlural(names)} ${names.join(', ')}, which could not be installed: ${reason.replace(/[.\s]+$/, '')}.`;

export { failedText };
