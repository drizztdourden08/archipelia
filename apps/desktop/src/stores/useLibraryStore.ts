/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import type { LibraryState } from './library-store.type';
import { appApi } from '../ipc/app-api';

const useLibraryStore = createSessionStore<LibraryState>((set, get) => {
  const api = () => appApi();
  const afterPresets = async <T>(result: T) => { await get().loadPresets(); return result; };
  const afterTemplates = async <T>(result: T) => { await get().loadTemplates(); return result; };
  const afterGames = async <T>(result: T) => { set({ installed: await api().gamesList() }); return result; };
  return {
    installed: [],
    catalog: null,
    official: [],
    presets: [],
    templates: [],
    loadGames: async (refreshCatalog = false) => {
      const [installed, official, catalog] = await Promise.all([
        api().gamesList(), api().catalogOfficial(), api().catalogRead(refreshCatalog),
      ]);
      set({ installed, official, catalog });
    },
    loadInstalled: async () => set({ installed: await api().gamesList() }),
    install: async (request) => afterGames(await api().gamesInstall(request)),
    removeGame: async (apworld) => afterGames(await api().gamesRemove(apworld)),
    loadPresets: async () => set({ presets: await api().presetsList() }),
    createPreset: async (preset) => afterPresets(await api().presetsCreate(preset)),
    savePreset: async (preset) => afterPresets(await api().presetsSave(preset)),
    duplicatePreset: async (id, name) => afterPresets(await api().presetsDuplicate(id, name)),
    removePreset: async (id) => afterPresets(await api().presetsRemove(id)),
    loadTemplates: async () => set({ templates: await api().templatesList() }),
    saveTemplate: async (template) => afterTemplates(await api().templatesSave(template)),
    removeTemplate: async (id) => afterTemplates(await api().templatesRemove(id)),
  };
});

export { useLibraryStore };
