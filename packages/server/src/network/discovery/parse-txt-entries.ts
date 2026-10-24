/* @layer core @kind logic */
const parseTxtEntries = (entries: string[]): Record<string, string> => {
  const map = new Map<string, string>();
  for (const entry of entries) {
    const at = entry.indexOf('=');
    if (at <= 0) continue;
    const key = entry.slice(0, at).toLowerCase();
    if (!map.has(key)) map.set(key, entry.slice(at + 1));
  }
  return Object.fromEntries(map);
};

export { parseTxtEntries };
