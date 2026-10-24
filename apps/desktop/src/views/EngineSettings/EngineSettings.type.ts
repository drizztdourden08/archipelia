/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { TagLook } from '@drizztdourden08/tessera/primitives';
import type { EngineChoice, EngineOverview } from '@archipelia/model';

type EngineActionsInput = {
  ready: boolean;
  building: boolean;
  setup: () => Promise<void>;
  refresh: () => Promise<void>;
  showProgress?: () => void;
};

type Picked = { ap?: string; python?: string };

type ChoicePlan = { kind: 'none' } | { kind: 'switch'; id: string } | { kind: 'install'; choice: EngineChoice };

type WhenForm = 'ago' | 'day' | 'time';

type WhenText = (at: number, form: WhenForm) => string;

type RowText = { label: string; description: string; hint: string; keywords?: string };

type TagView = { label: string; look: TagLook; title?: string };

type EngineTag = TagView & { key: string };

type FinishInstallInput = { ap: string; switchTo: (id: string) => Promise<void> };

type VersionRowsInput = {
  overview: EngineOverview;
  chosen: Picked;
  plan: ChoicePlan;
  busy: boolean;
  checking: boolean;
  tag: ReactNode;
  when: WhenText;
  onAp: (version: string) => void;
  onPython: (version: string) => void;
  onApply: () => void;
  onCheck: () => void;
};

export type { ChoicePlan, EngineActionsInput, EngineTag, FinishInstallInput, Picked, RowText, TagView, VersionRowsInput, WhenForm, WhenText };
