/* @layer core @kind logic */

const slotsKey = (slots: { name: string; game: string; yaml: string }[], worlds: string[]) =>
  `${slots.map((slot) => `${slot.name}|${slot.game}|${slot.yaml}`).sort().join(',')}/${[...worlds].sort().join(',')}`;

export { slotsKey };
