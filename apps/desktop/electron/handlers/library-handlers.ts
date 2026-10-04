/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';

const libraryHandlers: HandlerGroup = {
  id: 'archipelia-library',
  register: (ctx) => {
    const { presets, templates } = ctx.services;
    ctx.handle(APP_CHANNELS.presetsList, () => presets.list());
    ctx.handle(APP_CHANNELS.presetsCreate, (_event, preset) => presets.create(preset));
    ctx.handle(APP_CHANNELS.presetsSave, (_event, preset) => presets.save(preset));
    ctx.handle(APP_CHANNELS.presetsDuplicate, (_event, id, name) => presets.duplicate(id, name));
    ctx.handle(APP_CHANNELS.presetsRemove, (_event, id) => presets.remove(id));
    ctx.handle(APP_CHANNELS.templatesList, () => templates.list());
    ctx.handle(APP_CHANNELS.templatesSave, (_event, template) => templates.save(template));
    ctx.handle(APP_CHANNELS.templatesRemove, (_event, id) => templates.remove(id));
  },
};

export { libraryHandlers };
