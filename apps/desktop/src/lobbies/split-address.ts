/* @layer renderer-app @kind logic */
const splitAddress = (address: string | null): { ip: string; port: number } | null => {
  if (!address) return null;
  const cut = address.lastIndexOf(':');
  const port = Number(address.slice(cut + 1));
  return cut < 1 || !Number.isInteger(port) ? null : { ip: address.slice(0, cut), port };
};

export { splitAddress };
