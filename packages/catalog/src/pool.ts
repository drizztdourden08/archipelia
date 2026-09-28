/* @layer core @kind logic */
const mapPool = async <T, R>(items: T[], limit: number, run: (item: T) => Promise<R>) => {
  const out = new Array<R>(items.length);
  const queue = items.entries();
  const worker = async () => {
    for (const [i, item] of queue) out[i] = await run(item);
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
};

export { mapPool };
