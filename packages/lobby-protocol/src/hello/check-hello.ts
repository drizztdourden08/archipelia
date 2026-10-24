/* @layer protocol @kind logic */
import type { Hello } from '../messages/hello.type';
import type { Failure } from '../protocol/protocol.type';
import { REQUIRED_CAPABILITY, WORLD_CAPABILITY } from '../protocol/protocol.constants';

const missing = (field: string, message: string): Failure => ({ code: 'metadata-missing', message, field });

const checkWorlds = (hello: Hello): Failure | null => {
  if (!hello.capabilities.includes(WORLD_CAPABILITY)) {
    return hello.worlds.length === 0 ? null : missing('worlds', `Worlds need the ${WORLD_CAPABILITY} capability.`);
  }
  const games = new Set(hello.slots.map((slot) => slot.game));
  const sent = hello.worlds.map((world) => world.game);
  if (new Set(sent).size !== sent.length) return missing('worlds', 'Each game has at most one world.');
  const absent = [...games].find((game) => !sent.includes(game));
  if (absent !== undefined) return missing('worlds', `No world was sent for ${absent}.`);
  const unused = sent.find((game) => !games.has(game));
  return unused === undefined ? null : missing('worlds', `No slot uses the world for ${unused}.`);
};

const checkHello = (hello: Hello): Failure | null => {
  if (!hello.capabilities.includes(REQUIRED_CAPABILITY)) {
    return missing('capabilities', `The ${REQUIRED_CAPABILITY} capability is required.`);
  }
  return checkWorlds(hello);
};

export { checkHello };
