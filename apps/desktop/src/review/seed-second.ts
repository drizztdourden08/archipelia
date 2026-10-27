/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { useLibraryStore } from '../stores/useLibraryStore';
import { REVIEW_PORT, REVIEW_PRESET, REVIEW_SECOND } from './review.constants';
import { reviewTemplate } from './review-template';

const seedSecond = async (): Promise<SessionTemplate | null> => {
  const api = appApi();
  const preset = (await api.presetsList()).find((entry) => entry.name === REVIEW_PRESET);
  if (!preset) return null;
  const saved = (await api.templatesList()).find((entry) => entry.name === REVIEW_SECOND);
  const template = await api.templatesSave({ ...reviewTemplate(preset, saved?.id), name: REVIEW_SECOND, host: { kind: 'local', port: REVIEW_PORT + 2 } });
  await useLibraryStore.getState().loadTemplates();
  return template;
};

export { seedSecond };
