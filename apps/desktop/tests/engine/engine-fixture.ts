/* @layer tests @kind test */
import type { ApRelease, EngineOverview, InstalledEngine, PythonBuild, VersionFeed } from '@archipelia/model';

const release = (version: string): ApRelease => ({ version, tag: version, publishedAt: '2026-10-04T00:00:00Z', notesUrl: `https://example.test/${version}` });

const build = (version: string, extra: Partial<PythonBuild> = {}): PythonBuild => ({
  version, release: '20261021', target: 'win32-x64', file: `cpython-${version}.tar.gz`, sha256: 'abc', ...extra,
});

const engine = (ap: string, python: string, extra: Partial<InstalledEngine> = {}): InstalledEngine => ({
  id: `ap-${ap}_py-${python}_win32-x64`, ap, apCommit: 'deadbeef', python, pythonRelease: '20260924', target: 'win32-x64', builtAt: 1_760_000_000_000, state: 'ready', ...extra,
});

const feedOf = (patch: Partial<VersionFeed> = {}): VersionFeed => ({
  state: 'fresh',
  checkedAt: 1_760_100_000_000,
  releases: [release('0.6.8'), release('0.6.7'), release('0.6.2')],
  python: [build('3.13.17'), build('3.12.15'), build('3.12.14', { pinned: true, release: '20260924' })],
  ...patch,
});

const overviewOf = (patch: Partial<EngineOverview> = {}): EngineOverview => {
  const active = engine('0.6.7', '3.12.14');
  return {
    status: { state: 'ready', apVersion: '0.6.7', dir: 'C:/engine' },
    active,
    installed: [active],
    feed: feedOf(),
    tag: 'new-version',
    latestAp: '0.6.8',
    ...patch,
  };
};

const when = (at: number, form: string): string => `${form}:${at}`;

export { engine, feedOf, overviewOf, release, when };
