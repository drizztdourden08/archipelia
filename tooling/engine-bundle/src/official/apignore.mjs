/* @layer tooling-scripts @kind logic */
const escape = (text) => text.replace(/[.+^${}()|[\]\\]/g, '\\$&');

const globToRegex = (glob) =>
  glob.split(/(\*\*\/|\/\*\*|\*\*|\*|\?)/).map((part) => {
    if (part === '**/') return '(?:.*/)?';
    if (part === '/**') return '(?:/.*)?';
    if (part === '**') return '.*';
    if (part === '*') return '[^/]*';
    if (part === '?') return '[^/]';
    return escape(part);
  }).join('');

const parseRule = (line) => {
  const negate = line.startsWith('!');
  let body = negate ? line.slice(1) : line;
  const dirOnly = body.endsWith('/');
  if (dirOnly) body = body.slice(0, -1);
  const anchored = body.includes('/');
  if (body.startsWith('/')) body = body.slice(1);
  const regex = new RegExp(anchored ? `^${globToRegex(body)}$` : `^(?:.*/)?${globToRegex(body)}$`);
  return { negate, dirOnly, regex };
};

const parseIgnore = (lines) =>
  lines.map((line) => line.trimEnd()).filter((line) => line.length > 0 && !line.startsWith('#')).map(parseRule);

const matches = (rules, path, isDir) =>
  rules.reduce((ignored, rule) => ((!rule.dirOnly || isDir) && rule.regex.test(path) ? !rule.negate : ignored), false);

const createIgnore = (lines) => {
  const rules = parseIgnore(lines);
  return (path) => {
    const parts = path.split('/');
    const dirs = parts.slice(0, -1).map((_, i) => parts.slice(0, i + 1).join('/'));
    return dirs.some((dir) => matches(rules, dir, true)) || matches(rules, path, false);
  };
};

export { createIgnore };
