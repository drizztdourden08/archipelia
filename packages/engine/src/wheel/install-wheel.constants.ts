/* @layer core @kind config */

const SHA256 = /^[0-9a-f]{64}$/;

const REPLACES_INDEX = (name: string) =>
  `${name} is already in the engine from the Python Package Index. Archipelia will not replace it with a file from a release page.`;

export { REPLACES_INDEX, SHA256 };
