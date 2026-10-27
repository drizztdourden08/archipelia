/* @layer renderer-app @kind component */
import { RadioGroup, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { hasAlternative } from '../../behavior/has-alternative';
import { PLAN_TEXT } from '../../PackageSourceDialog.constants';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import { WheelDetails } from '../WheelDetails';
import { routeOptions } from './behavior/route-options';
import { versionOf } from './behavior/version-of';
import type { FoundPlanProps } from './FoundPlan.type';

const FoundPlan = ({ plan, route, typed, onRoute, onTyped }: FoundPlanProps) => {
  const { version, date } = versionOf(plan);
  if (!hasAlternative(plan)) {
    return (
      <Stack gap="sm">
        <Text>{PLAN_TEXT.noBuild(version, date)}</Text>
        <Text tone="dim">{plan.wheelState === 'unknown' ? PLAN_TEXT.wheelUnknown : PLAN_TEXT.wheelNone}</Text>
        {plan.pypi && !plan.pypi.linked && <Text tone="dim">{PLAN_TEXT.pypiUnlinked(plan.pypi.name)}</Text>}
      </Stack>
    );
  }
  return (
    <Stack gap="md">
      <RadioGroup label={STEP_TEXT.routeLegend} value={route} options={routeOptions(plan)} onChange={onRoute} />
      {route === 'wheel' && plan.wheel && <WheelDetails plan={plan} wheel={plan.wheel} typed={typed} onTyped={onTyped} />}
    </Stack>
  );
};

export { FoundPlan };
