/* @layer core @kind logic */
import type { CatalogEntry, CatalogVersion, FuzzVerdict, Stability } from '@archipelia/model';
import { posix } from 'node:path';
import { STABILITY } from './parse-entry.constants';
import type { IndexSource } from './index-source.type';
import type { EntryToml, FuzzToml, LockToml, VersionToml } from './index-toml.type';
import { rawUrl } from './raw-url';
import { isEntryToml } from './is-entry-toml';
import { parseToml } from './parse-toml';

const toStability = (raw?: string): Stability =>
  STABILITY.has(raw as Stability) ? (raw as Stability) : 'unknown';

const versionUrl = (source: IndexSource, toml: EntryToml, version: string, v: VersionToml) => {
  if (v.url) return v.url;
  if (v.local) return rawUrl(source, posix.join('index', v.local));
  if (toml.default_url) return toml.default_url.replaceAll('{{version}}', version);
  return undefined;
};

const latestFuzz = (runs: FuzzToml[], version: string): FuzzVerdict | undefined => {
  const run = runs.filter((r) => r.version === version).sort((a, b) => b.fuzzed_at.localeCompare(a.fuzzed_at))[0];
  return run && { verdict: run.verdict, fuzzedAt: run.fuzzed_at, seeds: run.seeds, failRate: run.default_rate };
};

const parseVersions = (source: IndexSource, toml: EntryToml, hashes: Record<string, string>) =>
  Object.entries(toml.versions ?? {}).flatMap(([version, v]): CatalogVersion[] => {
    const url = versionUrl(source, toml, version, v);
    if (!url) return [];
    return [{ version, url, sha256: hashes[version], fuzz: latestFuzz(toml.fuzz_results ?? [], version) }];
  });

const parseEntry = (source: IndexSource, apworld: string, text: string, lock: LockToml): CatalogEntry | undefined => {
  const toml = parseToml(text, isEntryToml, `index/${apworld}.toml`);
  if (toml.disabled) return undefined;
  return {
    apworld,
    game: toml.name,
    displayName: toml.display_name ?? toml.name,
    home: toml.home,
    setupGuide: toml.setup_guide,
    tracker: toml.tracker,
    tags: toml.tags ?? [],
    source: toml.supported ? 'official' : 'index',
    stability: toStability(toml.stability),
    versions: parseVersions(source, toml, lock[apworld] ?? {}),
  };
};

export { parseEntry };
