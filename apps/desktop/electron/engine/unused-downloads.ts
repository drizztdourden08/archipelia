/* @layer electron-main @kind logic */
import type { InstalledEngine } from '@archipelia/model';

const ownsDownload = (engine: InstalledEngine, name: string) =>
  (engine.apCommit !== '' && name === `ap-${engine.apCommit}.tar.gz`) || name.startsWith(`cpython-${engine.python}+${engine.pythonRelease}-`);

const unusedDownloads = (names: readonly string[], removed: InstalledEngine, kept: readonly InstalledEngine[]): string[] =>
  names.filter((name) => ownsDownload(removed, name) && !kept.some((engine) => ownsDownload(engine, name)));

export { unusedDownloads };
