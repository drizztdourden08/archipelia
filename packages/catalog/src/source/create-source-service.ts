/* @layer core @kind logic */
import type { SourceBuildRequest, SourceBuildStart, SourcePypiInstall, SourceRef, SourceWheelRequest, SuggestRequest } from '@archipelia/model';
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
import { createBuilds } from '../build/create-builds';
import { createPlannedSources } from '../build/create-planned-sources';
import { parseBuildRequest } from '../build/parse-build-request';
import { parseBuildStart } from '../build/parse-build-start';
import { createOfferedWheels } from '../wheel/create-offered-wheels';
import { parseWheelRequest } from '../wheel/parse-wheel-request';
import { prepareWheel } from '../wheel/prepare-wheel';

const createSourceService = ({ fetch: request = fetch, engineDir, worldOf, run, log }: SourceServiceDeps) => {
  const client = createGithubClient({ fetch: request });
  const deps = { client, fetch: request, engineDir };

  const suggest = async (raw: SuggestRequest) => {
    const { apworld, module, linked, paste } = parseSuggestRequest(raw);
    const world = worldContextOf({ linked, ...(await worldOf(apworld)) });
    return suggestSources({ client, now: Date.now }, { module: moduleNameOf(module), world, paste });
  };

  const offers = createOfferedWheels();
  const planned = createPlannedSources();
  const builds = createBuilds({ fetch: request, engineDir, run, log });

  const plan = async (raw: SourceRef) => {
    const made = await planSource(deps, parseSourceRef(raw));
    offers.offer(made);
    planned.remember(made);
    return made;
  };

  const pypiPreview = (raw: SourceRef) => previewPypiPackage(deps, parseSourceRef(raw));

  const pypiInstall = (raw: SourcePypiInstall) => {
    const accepted = isRecord(raw) && isStringList(raw.packages) ? raw.packages : [];
    return installPypiPackage(deps, parseSourceRef(raw), accepted);
  };

  const wheel = (raw: SourceWheelRequest) => {
    const ask = parseWheelRequest(raw);
    offers.assertOffered(ask);
    return prepareWheel(deps, ask);
  };

  const buildPrepare = (raw: SourceBuildStart) => builds.prepare(planned.recall(parseBuildStart(raw)));

  const buildStart = (raw: SourceBuildRequest) => builds.build(parseBuildRequest(raw));

  return { buildCancel: builds.cancel, buildPrepare, buildStart, dispose: builds.dispose, plan, processSpec: builds.specOf, pypiInstall, pypiPreview, suggest, wheel };
};

export { createSourceService };
