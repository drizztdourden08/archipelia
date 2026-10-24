/* @layer core @kind logic */

const engineId = (ap: string, python: string, target: string): string => `ap-${ap}_py-${python}_${target}`;

export { engineId };
