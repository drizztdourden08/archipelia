/* @layer core @kind types */
import type { SessionTemplate } from '@archipelia/model';
import type { createTemplateStore } from './create-template-store';
import type { createRunStore } from './create-run-store';

type TemplateStore = ReturnType<typeof createTemplateStore>;

type RunStore = ReturnType<typeof createRunStore>;

type TemplateLookup = () => Promise<readonly SessionTemplate[]>;

export type { RunStore, TemplateLookup, TemplateStore };
