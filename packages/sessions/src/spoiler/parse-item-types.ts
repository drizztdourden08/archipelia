/* @layer core @kind logic */
import { classOfFlags } from './class-of-flags';
import { placementKey } from './placement-key';
import type { ItemClass, SpoilerItemTypes } from './spoiler.type';

type SidecarRow = { finder: string; location: string; flags: number };

const isRow = (value: unknown): value is SidecarRow => {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  return typeof row.finder === 'string' && typeof row.location === 'string' && typeof row.flags === 'number';
};

const rowsOf = (text: string): SidecarRow[] | null => {
  try {
    const parsed: unknown = JSON.parse(text);
    const list = typeof parsed === 'object' && parsed !== null ? (parsed as { placements?: unknown }).placements : null;
    return Array.isArray(list) ? list.filter(isRow) : null;
  } catch {
    return null;
  }
};

const parseItemTypes = (text: string | null): SpoilerItemTypes | null => {
  const rows = text === null ? null : rowsOf(text);
  if (!rows) return null;
  const classes = new Map<string, ItemClass>(rows.map((row) => [placementKey(row.finder, row.location), classOfFlags(row.flags)]));
  return {
    players: [...new Set(rows.map((row) => row.finder))],
    locations: new Set(rows.map((row) => row.location)),
    classes,
  };
};

export { parseItemTypes };
