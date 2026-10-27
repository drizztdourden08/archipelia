/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { withoutLobbyId } from '../live/without-lobby-id';

const libraryHandlers: HandlerGroup = {
  id: 'archipelia-library',
  register: (ctx) => {
    const { live, presets, templates } = ctx.services;
    ctx.handle(APP_CHANNELS.presetsList, () => presets.list());
    ctx.handle(APP_CHANNELS.presetsCreate, (_event, preset) => presets.create(preset));
    ctx.handle(APP_CHANNELS.presetsSave, (_event, preset) => presets.save(preset));
    ctx.handle(APP_CHANNELS.presetsDuplicate, (_event, id, name) => presets.duplicate(id, name));
    ctx.handle(APP_CHANNELS.presetsRemove, (_event, id) => presets.remove(id));
    ctx.handle(APP_CHANNELS.templatesList, async () => live.withTabs(await templates.list()));
    ctx.handle(APP_CHANNELS.templatesSave, async (_event, template) => {
      const saved = await templates.save(withoutLobbyId(template));
      return (await live.withTabs([saved]))[0] ?? saved;
    });
    ctx.handle(APP_CHANNELS.templatesRemove, async (_event, id) => {
      await live.dropSession(id);
      await templates.remove(id);
    });
  },
};

export { libraryHandlers };
