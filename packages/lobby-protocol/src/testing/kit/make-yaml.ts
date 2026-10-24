/* @layer testing @kind logic */
import type { YamlSpec } from './kit.type';

const makeYaml = (spec: YamlSpec): Uint8Array => {
  const base = `name: ${spec.name}\ngame: ${spec.game}\n${spec.game}:\n  progression_balancing: 50\n`;
  const rest = spec.size - base.length;
  if (rest < 0) throw new Error(`a YAML of ${spec.size} bytes cannot hold its own fields`);
  const padding = rest >= 3 ? `#${'x'.repeat(rest - 2)}\n` : ' '.repeat(rest);
  return new TextEncoder().encode(base + padding);
};

export { makeYaml };
