/* @layer core @kind logic */
import type { Requiring } from './requires-graph.type';

const installOrder = (index: Requiring[], apworld: string): string[] => {
  const byName = new Map(index.map((world) => [world.apworld, world]));
  const order: string[] = [];
  const visit = (name: string, path: string[]) => {
    if (order.includes(name)) return;
    if (path.includes(name)) throw new Error(`official worlds require each other: ${[...path, name].join(' -> ')}`);
    const world = byName.get(name);
    if (!world) throw new Error(`${name} is not an official world`);
    world.requires.forEach((dep) => visit(dep, [...path, name]));
    order.push(name);
  };
  visit(apworld, []);
  return order;
};

export { installOrder };
