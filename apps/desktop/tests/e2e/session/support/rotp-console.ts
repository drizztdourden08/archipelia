/* @layer tests @kind helper */
import { eventsOf } from './rotp-instance';

const REFUSED = 'lobby-join-refused';

const reasonOf = (entry: { reason?: unknown }): string => (typeof entry.reason === 'string' ? entry.reason : 'no reason given');

const joinRefusalOf = async (eventLog: string): Promise<string | undefined> => {
  const refusals = (await eventsOf(eventLog)).filter((entry) => entry.t === REFUSED).map(reasonOf);
  return refusals.length === 0 ? undefined : refusals.join(' then ');
};

export { joinRefusalOf };
