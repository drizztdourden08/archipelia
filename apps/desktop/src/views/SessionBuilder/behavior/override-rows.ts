/* @layer renderer-app @kind logic */
import type { GamePreset, GameSchema, OptionDef } from '@archipelia/model';
import { checkValues, resolveValues, valueOf } from '@archipelia/presets';
import type { OverrideRow, Overrides, RowFilter } from '../SessionBuilder.type';

const matchesQuery = (def: OptionDef, query: string) => {
  const needle = query.trim().toLowerCase();
  return !needle || `${def.displayName} ${def.key} ${def.group}`.toLowerCase().includes(needle);
};

const overrideRows = (schema: GameSchema, preset: GamePreset | undefined, overrides: Overrides, filter: RowFilter = {}): OverrideRow[] => {
  const { query = '', changedOnly = false } = filter;
  const base = resolveValues(schema, preset?.values ?? {});
  const values = resolveValues(schema, preset?.values ?? {}, overrides);
  const problems = new Map(checkValues(schema, values).map((problem) => [problem.key, `must be ${problem.expected}`]));
  return schema.options
    .filter((def) => matchesQuery(def, query) && (!changedOnly || def.key in overrides))
    .map((def) => ({
      def, presetValue: valueOf(base, def), value: valueOf(values, def), overridden: def.key in overrides, problem: problems.get(def.key),
    }));
};

export { overrideRows };
