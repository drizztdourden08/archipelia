/* @layer tests @kind helper */
import type { LaunchedApp } from './launched-app.type';
import { proof } from './proof';

const SETTLE_MS = 3000;

const animationsDone = (limitMs: number) => {
  const finite = document.getAnimations().filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity);
  const limit = new Promise((resolve) => { setTimeout(resolve, limitMs); });
  return Promise.race([Promise.all(finite.map((animation) => animation.finished.catch(() => null))), limit]);
};

const settledProof = async (launched: LaunchedApp, name: string) => {
  await launched.page.evaluate(animationsDone, SETTLE_MS);
  await launched.page.evaluate(animationsDone, SETTLE_MS);
  return proof(launched, name);
};

export { settledProof };
