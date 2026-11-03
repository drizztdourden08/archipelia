/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { useLibraryStore } from '../stores/useLibraryStore';
import { REVIEW_PRESET } from './review.constants';
import { reviewTemplate } from './review-template';

const saveReviewTemplate = async (name: string, shape: (base: SessionTemplate) => SessionTemplate): Promise<SessionTemplate | null> => {
  const api = appApi();
  const preset = (await api.presetsList()).find((entry) => entry.name === REVIEW_PRESET);
  if (!preset) return null;
  const saved = (await api.templatesList()).find((entry) => entry.name === name);
  const template = await api.templatesSave(shape({ ...reviewTemplate(preset, saved?.id), name }));
  await useLibraryStore.getState().loadTemplates();
  return template;
};

export { saveReviewTemplate };
