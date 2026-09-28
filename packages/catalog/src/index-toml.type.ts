/* @layer core @kind types */

type VersionToml = { url?: string; local?: string };

type FuzzToml = { version: string; verdict: 'clean' | 'flaky' | 'broken'; fuzzed_at: string; seeds: number; default_rate: number };

type EntryToml = {
  name: string;
  display_name?: string;
  home?: string;
  tags?: string[];
  stability?: string;
  setup_guide?: string;
  tracker?: string;
  supported?: boolean;
  disabled?: boolean;
  default_url?: string;
  versions?: Record<string, VersionToml>;
  fuzz_results?: FuzzToml[];
};

type RootToml = { archipelago_repo: string; archipelago_version: string; index_dir: string };

type LockToml = Record<string, Record<string, string>>;

export type { EntryToml, FuzzToml, LockToml, RootToml, VersionToml };
