/* @layer core @kind logic */
import { createRecordStore } from '@archipelia/presets';
import { templateOf } from '@archipelia/model';
import type { DataFiles, SessionTemplate, StoredTemplate } from '@archipelia/model';
import { newId } from '@drizztdourden08/brock-core/storage';
import { TEMPLATES_DIR } from './session-stores.constants';

const createTemplateStore = (files: DataFiles) => {
  const records = createRecordStore<StoredTemplate>(files, TEMPLATES_DIR);
  const get = async (id: string): Promise<SessionTemplate | null> => {
    const stored = await records.get(id);
    return stored ? templateOf(stored) : null;
  };
  const list = async (): Promise<SessionTemplate[]> => (await records.list()).map(templateOf);
  const save = (template: SessionTemplate): Promise<SessionTemplate> => records.put({ ...template, updatedAt: Date.now() });
  const create = (template: Omit<SessionTemplate, 'id' | 'updatedAt'>) => save({ ...template, id: newId(), updatedAt: 0 });
  return { get, list, remove: records.remove, create, save };
};

export { createTemplateStore };
