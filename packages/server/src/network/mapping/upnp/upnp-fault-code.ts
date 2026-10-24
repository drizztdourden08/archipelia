/* @layer core @kind logic */
const upnpFaultCode = (error: unknown): number | null => {
  if (typeof error !== 'object' || error === null) return null;
  const { code } = error as { code?: unknown };
  return typeof code === 'number' ? code : null;
};

export { upnpFaultCode };
