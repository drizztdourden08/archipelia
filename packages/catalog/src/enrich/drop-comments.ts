/* @layer core @kind logic */

const dropComments = (line: string): string => {
  let out = line;
  for (let open = out.indexOf('<!--'); open !== -1; open = out.indexOf('<!--')) {
    const close = out.indexOf('-->', open + 4);
    out = close === -1 ? out.slice(0, open) : out.slice(0, open) + out.slice(close + 3);
  }
  return out;
};

export { dropComments };
