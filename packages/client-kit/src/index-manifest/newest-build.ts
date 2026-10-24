/* @layer client-kit @kind logic */
import type { ApworldBuildRecord, ApworldIndex } from './index.type';
import { compareApVersions } from '../versions/compare-ap-versions';

const newestBuild = ({ builds }: Pick<ApworldIndex, 'builds'>): ApworldBuildRecord | undefined =>
  [...builds].sort((a, b) => compareApVersions(b.archipelagoVersion, a.archipelagoVersion))[0];

export { newestBuild };
