/* @layer tooling-scripts @kind logic */
const ABSOLUTE = /^(\s*)(?:from|import)\s+worlds\.(\w+)/;
const RELATIVE = /^(\s*)from\s+(\.+)(\w+)/;

const indentOf = (line) => line.length - line.trimStart().length;

const insideTry = (lines, at) => {
  const indent = indentOf(lines[at]);
  for (let i = at - 1; i >= 0; i--) {
    if (lines[i].trim().length === 0 || indentOf(lines[i]) >= indent) continue;
    return /^\s*try\s*:/.test(lines[i]);
  }
  return false;
};

const targetOf = (line, depth) => {
  const absolute = ABSOLUTE.exec(line);
  if (absolute) return absolute[2];
  const relative = RELATIVE.exec(line);
  return relative && relative[2].length === depth + 2 ? relative[3] : undefined;
};

const importsIn = (source, depth) => {
  const lines = source.split(/\r?\n/);
  return lines.flatMap((line, i) => {
    const target = targetOf(line, depth);
    return target ? [{ target, optional: insideTry(lines, i) }] : [];
  });
};

const worldImports = (files, self, official) => {
  const requires = new Set();
  const optional = new Set();
  for (const { path, source } of files) {
    for (const { target, optional: soft } of importsIn(source, path.split('/').length - 1)) {
      if (target === self || !official.has(target)) continue;
      (soft ? optional : requires).add(target);
    }
  }
  for (const hard of requires) optional.delete(hard);
  return { requires: [...requires].sort(), optional: [...optional].sort() };
};

export { worldImports };
