/* @layer client-kit @kind logic */
import type { ApworldNames } from './index.type';

const apworldNames = (module: string, archipelagoVersion: string): ApworldNames => {
  const file = `${module}-ap${archipelagoVersion}.apworld`;
  const latest = `${module}.apworld`;
  return { file, bundle: `${file}.sigstore.json`, latest, latestBundle: `${latest}.sigstore.json`, index: `${latest}.json` };
};

export { apworldNames };
