/* @layer core @kind logic */
import type { SourcePypiInstall, SourceRef, SourceWheelRequest, SuggestRequest } from '@archipelia/model';
import { isRecord, isStringList } from '@archipelia/model';
import { createGithubClient } from './create-github-client';
import { installPypiPackage } from './install-pypi-package';
import { moduleNameOf } from './module-name-of';
import { parseSourceRef } from './parse-source-ref';
import { parseSuggestRequest } from './parse-suggest-request';
import { planSource } from './plan-source';
import { previewPypiPackage } from './preview-pypi-package';
import type { SourceServiceDeps } from './source.type';
import { suggestSources } from './suggest-sources';
import { worldContextOf } from './world-context-of';
import { parseWheelRequest } from '../wheel/parse-wheel-request';
import { prepareWheel } from '../wheel/prepare-wheel';

const createSourceService = ({ fetch: request = fetch, engineDir, worldOf }: SourceServiceDeps) => {
  const client = createGithubClient({ fetch: request });
  const deps = { client, fetch: request, engineDir };

  const suggest = async (raw: SuggestRequest) => {
    const { apworld, module, linked, paste } = parseSuggestRequest(raw);
    const world = worldContextOf({ linked, ...(await worldOf(apworld)) });
    return suggestSources({ client, now: Date.now }, { module: moduleNameOf(module), world, paste });
  };

  const plan = (raw: SourceRef) => planSource(deps, parseSourceRef(raw));

  const pypiPreview = (raw: SourceRef) => previewPypiPackage(deps, parseSourceRef(raw));

  const pypiInstall = (raw: SourcePypiInstall) => {
    const accepted = isRecord(raw) && isStringList(raw.packages) ? raw.packages : [];
    return installPypiPackage(deps, parseSourceRef(raw), accepted);
  };

  const wheel = (raw: SourceWheelRequest) => prepareWheel(deps, parseWheelRequest(raw));

  return { plan, pypiInstall, pypiPreview, suggest, wheel };
};

export { createSourceService };
