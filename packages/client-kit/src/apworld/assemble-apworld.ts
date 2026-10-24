/* @layer client-kit @kind logic */
import type { AssembleInput, AssembledApworld } from './apworld.type';
import type { ApworldEntry } from '../zip/zip.type';
import { createKitError } from '../errors/create-kit-error';
import { buildArchipelagoJson } from '../manifest/build-archipelago-json';
import { MANIFEST_FILE, MODULE_NAME } from '../manifest/manifest.constants';
import { parseArchipelagoJson } from '../manifest/parse-archipelago-json';
import { zipApworld } from '../zip/zip-apworld';
import { DEFAULT_DATA_DIR, PACKAGE_MARKER } from './apworld.constants';
import { encodeDataFile } from './encode-data-file';

const encoder = new TextEncoder();

const assembleApworld = (input: AssembleInput): AssembledApworld => {
  const { module, files, data = {}, dataDir = DEFAULT_DATA_DIR } = input;
  if (!MODULE_NAME.test(module)) {
    throw createKitError('invalid-package', `The module name "${module}" must be a Python package name such as relic_of_the_past.`);
  }
  const manifestText = buildArchipelagoJson(input);
  const generated: ApworldEntry[] = Object.entries(data).map(([name, content]) => ({
    path: `${dataDir}/${name}`,
    bytes: encodeDataFile(content),
  }));
  const replaced = new Set([MANIFEST_FILE, ...generated.map(({ path }) => path)]);
  const kept = files.filter(({ path }) => !replaced.has(path));
  if (!kept.some(({ path }) => path === PACKAGE_MARKER)) {
    throw createKitError('invalid-package', `The world package has no ${PACKAGE_MARKER} at its top level, so Archipelago cannot import it.`);
  }
  const entries = [...kept, ...generated, { path: MANIFEST_FILE, bytes: encoder.encode(manifestText) }];
  const bytes = zipApworld(entries.map(({ path, bytes: content }) => ({ path: `${module}/${path}`, bytes: content })));
  return { module, manifest: parseArchipelagoJson(manifestText), manifestText, bytes };
};

export { assembleApworld };
