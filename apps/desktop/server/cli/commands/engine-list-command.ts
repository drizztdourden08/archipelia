/* @layer server @kind logic */
import { withCore } from '../with-core';
import type { CliContext } from '../cli.type';

const engineListCommand = async (context: CliContext): Promise<number> => {
  const overview = await withCore(context, (core) => core.engine.overview());
  const { out } = context;
  if (overview.installed.length === 0) out('No engine is installed.');
  for (const engine of overview.installed) {
    const mark = engine.id === overview.active?.id ? '*' : ' ';
    out(`${mark} ${engine.id}  Archipelago ${engine.ap}  Python ${engine.python}  ${engine.state}`);
  }
  const offered = overview.feed.releases.slice(0, 8).map((release) => release.version);
  out(`Offered (${overview.feed.state}): ${offered.length > 0 ? offered.join(', ') : 'none'}`);
  return 0;
};

export { engineListCommand };
