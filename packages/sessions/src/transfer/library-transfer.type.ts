/* @layer core @kind types */
import type { PresetStore } from '@archipelia/presets';
import type { TemplateStore } from '../store/session-stores.type';

type LibraryStores = { presets: PresetStore; templates: TemplateStore };

type LibraryImportResult = { presets: number; templates: number };

export type { LibraryImportResult, LibraryStores };
