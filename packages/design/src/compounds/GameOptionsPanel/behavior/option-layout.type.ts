/* @layer renderer-app @kind types */
import type { OptionDef, OptionValue } from '@archipelia/model';

type RowControl = 'toggle' | 'segmented' | 'dropdown' | 'slider' | 'number' | 'text' | 'custom';

type TermFact = { term: string; text: string };

type LayoutRow = {
  key: string;
  def: OptionDef;
  label: string;
  description: string;
  facts: TermFact[];
  hint?: string;
  control: RowControl;
  value: OptionValue;
  defaultValue: OptionValue;
  changed: boolean;
  advanced: boolean;
};

type LayoutTab = { id: string; label: string; changed: number; basic: LayoutRow[]; advanced: LayoutRow[] };

type OptionLayout = { tabs: LayoutTab[]; changedRows: LayoutRow[] };

export type { LayoutRow, LayoutTab, OptionLayout, RowControl, TermFact };
