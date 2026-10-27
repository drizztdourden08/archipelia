/* @layer renderer-app @kind types */
import type { SourcePlan } from '@archipelia/model';
import type { SourceRoute } from '../../PackageSourceDialog.type';

type FoundPlanProps = {
  plan: SourcePlan;
  route: SourceRoute | '';
  typed: string;
  onRoute: (route: SourceRoute | '') => void;
  onTyped: (typed: string) => void;
};

export type { FoundPlanProps };
