/* @layer renderer-app @kind logic */
import type { RadioOption } from '@drizztdourden08/tessera/primitives';
import type { SourcePlan } from '@archipelia/model';
import { PLAN_TEXT } from '../../../PackageSourceDialog.constants';
import type { SourceRoute } from '../../../PackageSourceDialog.type';
import { STEP_TEXT } from '../../../behavior/step-text.constants';
import { versionOf } from './version-of';

const routeOptions = (plan: SourcePlan): RadioOption<SourceRoute | ''>[] => {
  const { wheel, pypi } = plan;
  const { version, date } = versionOf(plan);
  const options: RadioOption<SourceRoute | ''>[] = [];
  if (wheel) options.push({ value: 'wheel', label: STEP_TEXT.routeWheel, description: `${PLAN_TEXT.wheelFound(wheel.asset, wheel.tag)} ${PLAN_TEXT.wheelFit[wheel.fit]}` });
  if (pypi?.linked) options.push({ value: 'pypi', label: STEP_TEXT.routePypi, description: PLAN_TEXT.pypiLinked(`${plan.owner}/${plan.repo}`, pypi.name) });
  options.push({ value: 'source', label: STEP_TEXT.routeSource, description: PLAN_TEXT.orBuild(version, date) });
  return options;
};

export { routeOptions };
