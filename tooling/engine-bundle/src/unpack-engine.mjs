/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { apUrl } from './ap-url.mjs';
import { downloadTo } from './download.mjs';
import { pythonUrl } from './python-url.mjs';
import { extractTarGz } from './run.mjs';

const unpackEngine = async ({ spec, out, downloads, onLine, onStep, signal }) => {
  const { ap, python } = spec;
  onStep?.('python', `Downloading Python ${python.version}`);
  onLine?.(`Downloading Python ${python.version}`);
  await extractTarGz(await downloadTo(pythonUrl(python), join(downloads, python.file), python.sha256, signal), out, { onLine, signal });
  onStep?.('archipelago', `Downloading Archipelago ${ap.version}`);
  onLine?.(`Downloading Archipelago ${ap.version}`);
  onLine?.('GitHub archives have no checksum. The download is checked by HTTPS and the commit only.');
  const archive = await downloadTo(apUrl(ap.commit), join(downloads, `ap-${ap.commit}.tar.gz`), undefined, signal);
  await extractTarGz(archive, join(out, 'ap'), { strip: 1, onLine, signal });
};

export { unpackEngine };
