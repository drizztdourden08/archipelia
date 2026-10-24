/* @layer tooling-scripts @kind logic */

const pythonUrl = ({ release, file }) =>
  `https://github.com/astral-sh/python-build-standalone/releases/download/${release}/${encodeURIComponent(file)}`;

export { pythonUrl };
