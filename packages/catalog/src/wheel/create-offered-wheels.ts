/* @layer core @kind logic */
import type { SourcePlan, SourceWheelRequest } from '@archipelia/model';
import type { Offered } from './create-offered-wheels.type';
import { NOT_OFFERED } from './prepare-wheel.constants';

const keyOf = (owner: string, repo: string) => `${owner}/${repo}`.toLowerCase();

const createOfferedWheels = () => {
  const offered = new Map<string, Offered>();
  return {
    offer: ({ owner, repo, wheel }: SourcePlan): void => {
      if (wheel) offered.set(keyOf(owner, repo), { tag: wheel.tag, asset: wheel.asset });
      else offered.delete(keyOf(owner, repo));
    },
    assertOffered: ({ owner, repo, tag, asset }: SourceWheelRequest): void => {
      const found = offered.get(keyOf(owner, repo));
      if (found?.tag !== tag || found.asset !== asset) throw new Error(NOT_OFFERED);
    },
  };
};

export { createOfferedWheels };
