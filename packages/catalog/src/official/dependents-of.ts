/* @layer core @kind logic */
import type { Requiring } from './requires-graph.type';

const dependentsOf = (installed: Requiring[], apworld: string) =>
  installed.filter((world) => world.apworld !== apworld && world.requires.includes(apworld)).map((world) => world.apworld);

export { dependentsOf };
