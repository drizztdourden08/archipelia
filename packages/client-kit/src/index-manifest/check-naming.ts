/* @layer client-kit @kind logic */
import type { Failer } from '../errors/create-failer.type';
import type { ApworldBuildRecord } from './index.type';
import { readText } from './read-text';

const checkNaming = (fail: Failer, builds: readonly ApworldBuildRecord[], listed: readonly Record<string, unknown>[]): void => {
  for (const build of listed) {
    const rule = builds.find((candidate) => candidate.archipelagoVersion === build.archipelagoVersion);
    if (rule === undefined || rule.file !== build.file || rule.bundle !== build.bundle) {
      fail(`the file or bundle name of build ${readText(fail, build, 'archipelagoVersion')} breaks the naming rule.`);
    }
  }
};

export { checkNaming };
