/* @layer tests @kind helper */
import { eventsOf } from './rotp-instance';

const REFUSED = 'lobby-join-refused';

const joinRefusalOf = async (eventLog: string): Promise<string | undefined> => {
  const refused = (await eventsOf(eventLog)).find((entry) => entry.t === REFUSED);
  if (refused === undefined) return undefined;
  return typeof refused.reason === 'string' ? refused.reason : 'no reason given';
};

export { joinRefusalOf };
