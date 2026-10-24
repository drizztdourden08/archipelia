/* @layer renderer-app @kind logic */
import type { EngineChoice } from '@archipelia/model';
import { FIRST_RUN_TEXT } from './engine-startup.constants';
import type { EngineStartupDeps, OfferDecision, StartupCtx } from './engine-startup.type';
import { firstRunDialog } from './first-run-dialog';
import { listlessDialog } from './listless-dialog';
import { offerDialog } from './offer-dialog';
import { pickedChoice } from './picked-choice';
import { startupAction } from './startup-action';
import { startupWanted } from './startup-wanted';

const installAndFinish = async (deps: EngineStartupDeps, choice: EngineChoice): Promise<void> => {
  const { install, switchTo } = deps;
  await deps.finish(await install(choice), { ap: choice.ap, install, switchTo });
};

const askRelease = async (ctx: StartupCtx, dialog: ReturnType<typeof firstRunDialog>, choice: EngineChoice): Promise<string | null> => {
  if (dialog) return ctx.confirmChoice(dialog);
  return (await ctx.confirmAction(listlessDialog(choice))) ? choice.ap : null;
};

const runFirstRun = async (ctx: StartupCtx, deps: EngineStartupDeps, choice: EngineChoice): Promise<void> => {
  const overview = await deps.overview().catch(() => null);
  const ap = await askRelease(ctx, firstRunDialog(overview, choice), choice);
  if (ap === null) return;
  const picked = pickedChoice(overview, choice, ap);
  if (picked) await installAndFinish(deps, picked);
  else deps.tell(FIRST_RUN_TEXT.noPython(ap));
};

const runOffer = async (ctx: StartupCtx, deps: EngineStartupDeps, offer: OfferDecision): Promise<void> => {
  await deps.offerShown(offer.to);
  if (await ctx.confirmAction(offerDialog(offer, deps.openNotes))) await installAndFinish(deps, offer.choice);
};

const runEngineStartup = async (ctx: StartupCtx, deps: EngineStartupDeps): Promise<void> => {
  const checkAtStart = ctx.settings.get().engineCheckAtStart;
  if (!startupWanted(checkAtStart, await deps.status())) return;
  const decision = startupAction(await deps.startup(), checkAtStart);
  if (decision.kind === 'first-run') await runFirstRun(ctx, deps, decision.choice);
  if (decision.kind === 'offer') await runOffer(ctx, deps, decision);
};

export { runEngineStartup };
