/* @layer core @kind logic */
import type { SchemaRead } from '@archipelia/engine';
import type { LoadContext } from './load-failure.type';
import { loadFailure } from './load-failure';
import { missingOnPypi } from './missing-on-pypi';
import { missingPackageOf } from './missing-package-of';
import { PackageUnavailableError } from './package-unavailable-error';
import { unavailableText } from './unavailable-text';

const loadError = async (read: SchemaRead, game: string, context?: LoadContext): Promise<Error> => {
  const missing = missingPackageOf(read, context);
  const gone = context && missing ? await missingOnPypi([missing]) : [];
  if (!context || gone.length === 0) return new Error(loadFailure(read, game, context));
  const needs = gone.map((name) => ({ name }));
  return new PackageUnavailableError(unavailableText(context.label, needs), needs);
};

export { loadError };
