/* @layer core @kind types */
import type { TextBlock } from './enrich.type';

type LineKind = 'blank' | 'skip' | 'heading' | 'setext' | 'rule' | 'list' | 'quote' | 'indented' | 'text';

type BlockBuilder = {
  blocks: TextBlock[];
  flush: () => void;
  add: (line: string, prose: boolean) => void;
  setHeading: (text: string) => void;
  promote: () => void;
  hasProse: () => boolean;
  isOpen: () => boolean;
};

type LineHandler = (builder: BlockBuilder, trimmed: string) => void;

type LineStep = { line: string; comment: boolean };

type FenceStep = { fence: string; skip: boolean };

export type { BlockBuilder, FenceStep, LineHandler, LineKind, LineStep };
