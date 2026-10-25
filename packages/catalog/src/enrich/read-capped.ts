/* @layer core @kind logic */

const readCapped = async (res: Response, max: number): Promise<Uint8Array | undefined> => {
  if (Number(res.headers.get('content-length') ?? 0) > max) {
    await res.body?.cancel();
    return undefined;
  }
  const chunks: Uint8Array[] = [];
  let total = 0;
  for await (const chunk of (res.body ?? []) as AsyncIterable<Uint8Array>) {
    total += chunk.length;
    if (total > max) return undefined;
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

export { readCapped };
