/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';

const libraryHandlers: HandlerGroup = {
  id: 'archipelia-library',
  register: (ctx) => {
    const { presets, templates } = ctx.services;
    ctx.handle('ap:presets:list', () => presets.list());
    ctx.handle('ap:presets:create', (_event, preset) => presets.create(preset));
    ctx.handle('ap:presets:save', (_event, preset) => presets.save(preset));
    ctx.handle('ap:presets:duplicate', (_event, id, name) => presets.duplicate(id, name));
    ctx.handle('ap:presets:remove', (_event, id) => presets.remove(id));
    ctx.handle('ap:templates:list', () => templates.list());
    ctx.handle('ap:templates:save', (_event, template) => templates.save(template));
    ctx.handle('ap:templates:remove', (_event, id) => templates.remove(id));
  },
};

export { libraryHandlers };
