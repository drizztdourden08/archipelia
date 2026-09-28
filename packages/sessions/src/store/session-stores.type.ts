/* @layer core @kind types */
import type { createTemplateStore } from './create-template-store';
import type { createRunStore } from './create-run-store';

type TemplateStore = ReturnType<typeof createTemplateStore>;

type RunStore = ReturnType<typeof createRunStore>;

export type { RunStore, TemplateStore };
