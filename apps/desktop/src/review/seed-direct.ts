/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { useLibraryStore } from '../stores/useLibraryStore';
import { REVIEW_DIRECT, REVIEW_PORT, REVIEW_PRESET } from './review.constants';
import { reviewTemplate } from './review-template';

const seedDirect = async (): Promise<SessionTemplate | null> => {
  const api = appApi();
  const preset = (await api.presetsList()).find((entry) => entry.name === REVIEW_PRESET);
  if (!preset) return null;
  const saved = (await api.templatesList()).find((entry) => entry.name === REVIEW_DIRECT);
  const template = await api.templatesSave({ ...reviewTemplate(preset, saved?.id), name: REVIEW_DIRECT, host: { kind: 'local', port: REVIEW_PORT + 1 } });
  await useLibraryStore.getState().loadTemplates();
  return template;
};

export { seedDirect };
