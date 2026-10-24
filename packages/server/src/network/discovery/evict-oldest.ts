/* @layer core @kind logic */
const evictOldest = <T>(map: Map<string, T>, limit: number, key: string) => {
  if (map.has(key) || map.size < limit) return;
  const oldest = map.keys().next();
  if (!oldest.done) map.delete(oldest.value);
};

export { evictOldest };
