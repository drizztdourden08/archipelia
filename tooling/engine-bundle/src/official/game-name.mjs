/* @layer tooling-scripts @kind logic */
const OPTIONAL_TYPE = '(?:[ \\t]*:[^=\\n]+)?';
const LINE_END = '[ \\t]*(?:#.*)?$';
const QUOTED = '(["\'])(.+?)\\1';

const GAME_LINE = new RegExp(`^[ \\t]+game${OPTIONAL_TYPE}[ \\t]*=[ \\t]*(?:${QUOTED}|([A-Za-z_]\\w*))${LINE_END}`, 'gm');

const constantValue = (sources, name) => {
  const line = new RegExp(`^${name}${OPTIONAL_TYPE}[ \\t]*=[ \\t]*${QUOTED}${LINE_END}`, 'm');
  return sources.map((source) => line.exec(source)?.[2]).find((value) => value !== undefined);
};

const parseGameName = (sources) => {
  for (const source of sources) {
    for (const found of source.matchAll(GAME_LINE)) {
      const name = found[2] ?? constantValue(sources, found[3]);
      if (name) return name;
    }
  }
  return undefined;
};

const initFirst = (files) =>
  [...files.filter((f) => f.path === '__init__.py'), ...files.filter((f) => f.path !== '__init__.py')].map((f) => f.source);

export { initFirst, parseGameName };
