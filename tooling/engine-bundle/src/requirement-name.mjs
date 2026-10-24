/* @layer tooling-scripts @kind logic */

const requirementName = (spec) => (/^[A-Za-z0-9._-]+/.exec(spec.trim())?.[0] ?? spec).toLowerCase().replace(/[._]/g, '-');

export { requirementName };
