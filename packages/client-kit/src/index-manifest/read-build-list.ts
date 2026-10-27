/* @layer client-kit @kind logic */
import type { Failer } from '../errors/create-failer.type';
import type { ListedBuilds } from './read-build-list.type';
import { isPlainRecord } from '../yaml/emit/is-plain-record';
import { readText } from './read-text';

const readBuildList = (fail: Failer, record: Record<string, unknown>): ListedBuilds => {
  const listed = record.builds;
  if (!Array.isArray(listed) || !listed.every(isPlainRecord)) return fail('builds must be a list of objects.');
  const inputs = listed.map((build) => ({
    archipelagoVersion: readText(fail, build, 'archipelagoVersion'),
    sha256: readText(fail, build, 'sha256'),
    size: Number(build.size),
  }));
  return { listed, inputs };
};

export { readBuildList };
