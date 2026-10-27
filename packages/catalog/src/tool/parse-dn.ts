/* @layer core @kind logic */

const parseDn = (dn: string): Record<string, string[]> => {
  const fields: Record<string, string[]> = {};
  let part = '';
  let quoted = false;
  const flush = () => {
    const at = part.indexOf('=');
    const name = part.slice(0, at).trim().toUpperCase();
    if (at > 0) (fields[name] ??= []).push(part.slice(at + 1).trim().replace(/^"(.*)"$/, '$1').replaceAll('""', '"'));
    part = '';
  };
  for (const char of dn) {
    if (char === '"') quoted = !quoted;
    if (char === ',' && !quoted) flush();
    else part += char;
  }
  flush();
  return fields;
};

export { parseDn };
