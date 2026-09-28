/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { newId } from '@drizztdourden08/brock-core/storage';

const copyName = (name: string, taken: string[]) => {
  const base = `${name} copy`;
  if (!taken.includes(base)) return base;
  for (let n = 2; ; n += 1) if (!taken.includes(`${base} ${n}`)) return `${base} ${n}`;
};

const duplicateTemplate = (template: SessionTemplate, taken: string[], id: string = newId()): SessionTemplate => ({
  ...structuredClone(template),
  id,
  name: copyName(template.name, taken),
  updatedAt: 0,
});

export { duplicateTemplate };
