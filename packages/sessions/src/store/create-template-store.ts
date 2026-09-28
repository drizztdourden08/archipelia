/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { createRecordStore } from '@archipelia/presets';
import type { SessionTemplate } from '@archipelia/model';
import { newId } from '@drizztdourden08/brock-core/storage';
import { TEMPLATES_DIR } from './session-stores.constants';

const createTemplateStore = (files: FileStore) => {
  const records = createRecordStore<SessionTemplate>(files, TEMPLATES_DIR);
  const save = (template: SessionTemplate) => records.put({ ...template, updatedAt: Date.now() });
  const create = (template: Omit<SessionTemplate, 'id' | 'updatedAt'>) => save({ ...template, id: newId(), updatedAt: 0 });
  return { ...records, create, save };
};

export { createTemplateStore };
