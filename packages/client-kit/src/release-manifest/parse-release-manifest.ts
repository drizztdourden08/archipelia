/* @layer client-kit @kind logic */
import type { ReleaseInput, ReleaseManifest, ReleaseWorld } from './release.type';
import { createFailer } from '../errors/create-failer';
import { checkNaming } from '../index-manifest/check-naming';
import { readBuildList } from '../index-manifest/read-build-list';
import { readJson } from '../index-manifest/read-json';
import { readText } from '../index-manifest/read-text';
import { isPlainRecord } from '../yaml/emit/is-plain-record';
import { buildReleaseManifest } from './build-release-manifest';
import { MAX_MANIFEST_BYTES, RELEASE_FORMAT } from './release.constants';

const fail = createFailer('invalid-release', 'The release manifest is not valid: ');

const optionalText = (record: Record<string, unknown>, key: string): string | undefined =>
  record[key] === undefined ? undefined : readText(fail, record, key);

const worldOf = (raw: unknown): ReleaseWorld => {
  if (!isPlainRecord(raw)) return fail('world must be an object.');
  const bundle = optionalText(raw, 'bundle');
  return {
    file: readText(fail, raw, 'file'),
    sha256: readText(fail, raw, 'sha256'),
    size: Number(raw.size),
    ...(bundle === undefined ? {} : { bundle }),
  };
};

const sourceOf = (record: Record<string, unknown>): Pick<ReleaseInput, 'builds' | 'world'> & { listed: Record<string, unknown>[] } => {
  if (record.world !== undefined) return { world: worldOf(record.world), listed: [] };
  const { listed, inputs } = readBuildList(fail, record);
  return { builds: inputs, listed };
};

const readHeader = (source: string): Record<string, unknown> => {
  if (new TextEncoder().encode(source).length > MAX_MANIFEST_BYTES) return fail(`the file is larger than ${MAX_MANIFEST_BYTES} bytes.`);
  const record = readJson(fail, source);
  if (!isPlainRecord(record)) return fail('the top level must be an object.');
  if (record.format !== RELEASE_FORMAT) return fail(`format must be ${RELEASE_FORMAT}.`);
  if (typeof record.direct !== 'boolean') return fail('direct must be true or false.');
  return record;
};

const parseReleaseManifest = (source: string): ReleaseManifest => {
  const record = readHeader(source);
  const { listed, ...from } = sourceOf(record);
  const manifest = buildReleaseManifest({
    game: readText(fail, record, 'game'),
    module: readText(fail, record, 'module'),
    worldVersion: readText(fail, record, 'worldVersion'),
    minimumAp: readText(fail, record, 'minimumAp'),
    maximumAp: optionalText(record, 'maximumAp'),
    direct: record.direct === true,
    kit: readText(fail, record, 'kit'),
    appVersion: optionalText(record, 'appVersion'),
    ...from,
  });
  checkNaming(fail, manifest.builds ?? [], listed);
  return manifest;
};

export { parseReleaseManifest };
