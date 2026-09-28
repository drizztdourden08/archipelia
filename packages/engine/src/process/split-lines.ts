/* @layer core @kind logic */
const splitLines = (onLine: (line: string) => void) => {
  let rest = '';
  return (chunk: Buffer) => {
    const parts = (rest + chunk.toString('utf8')).split(/\r?\n/);
    rest = parts.pop() ?? '';
    parts.filter((part) => part.length > 0).forEach(onLine);
  };
};

export { splitLines };
