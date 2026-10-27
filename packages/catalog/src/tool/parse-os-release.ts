/* @layer core @kind logic */

const parseOsRelease = (text: string): Record<string, string> => {
  const fields: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const match = /^([A-Z_]+)=(.*)$/.exec(line.trim());
    const key = match?.[1];
    if (key !== undefined) fields[key] = (match?.[2] ?? '').replace(/^(["'])(.*)\1$/, '$2');
  }
  return fields;
};

export { parseOsRelease };
