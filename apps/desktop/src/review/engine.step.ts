/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { appApi } from '../ipc/app-api';
import { LIST_TEXT, ROW_TEXT, SECTION_TEXT, TAG_VIEW } from '../views/EngineSettings/EngineSettings.constants';
import { SELECTOR } from './review-dom.constants';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const anyCase = (text: string) => new RegExp(text, 'i');

export default defineReviewStep({
  run: async (tour) => {
    nav.open(ROUTE.engine);
    const layer = () => tour.find(SELECTOR.layer);
    const ready = await waitText(tour, 'Ready', layer, 10000);
    tour.check('engine-ready', ready, 'the Engine page says Ready', 'the Engine page never said Ready');
    const apVersion = (await appApi().engineStatus()).apVersion ?? 'an unknown version';
    const version = await waitText(tour, apVersion, layer);
    tour.check('engine-version', version, `the Engine page shows Archipelago ${apVersion}`, `the Engine page does not show ${apVersion}`);
    const check = await waitNamed(tour, SELECTOR.button, 'Check again', layer() ?? undefined);
    tour.check('engine-check-again', check !== null, 'Check again is offered once the engine is ready', 'no Check again button on the Engine page');

    const overview = await appApi().engineOverview().catch(() => null);
    tour.check('engine-overview', overview !== null, 'the engine versions were read', 'the engine versions could not be read');
    if (!overview) return;
    const python = await waitText(tour, anyCase(ROW_TEXT.python.label), layer);
    const archipelago = await waitText(tour, anyCase(ROW_TEXT.archipelago.label), layer);
    tour.check('engine-pickers', python && archipelago, 'the Archipelago and Python pickers are drawn', 'the Archipelago and Python pickers are missing');
    const tagLabel = TAG_VIEW[overview.tag].label;
    const tag = await waitText(tour, tagLabel, layer);
    tour.check('engine-version-tag', tag, `the version tag reads ${tagLabel}`, `the version tag does not read ${tagLabel}`);
    const startCheck = await waitText(tour, anyCase(ROW_TEXT.startCheck.label), layer);
    tour.check('engine-check-at-start', startCheck, 'the Engine page has the check at start setting', 'the Engine page has no check at start setting');
    const checkNow = await waitNamed(tour, SELECTOR.button, 'Check now', layer() ?? undefined);
    tour.check('engine-check-now', checkNow !== null, 'Check now is offered next to the version list', 'no Check now button on the Engine page');
    const installed = await waitText(tour, anyCase(SECTION_TEXT.installed.title), layer);
    const listed = overview.active ? await waitText(tour, anyCase(`Archipelago ${overview.active.ap}`), layer) : installed;
    tour.check('engine-installed-list', installed && listed, `${LIST_TEXT.label} lists the engine in use`, `${LIST_TEXT.label} does not list the engine in use`);
    await tour.capture('ready');
  },
});
