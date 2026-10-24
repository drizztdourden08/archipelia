/* @layer core @kind logic */
import type { MdnsAdvertiserOptions } from './advertise.type';
import { answerMdnsQueries } from './answer-mdns-queries';
import { REPEAT_MS } from './network-discovery.constants';

const startMdnsAdvertiser = ({ ports, records, repeatMs = REPEAT_MS, onError }: MdnsAdvertiserOptions) => {
  const mdns = ports.openMdns();
  if (onError) mdns.onError(onError);
  mdns.onQuery((questions) => {
    const answers = answerMdnsQueries(questions, records());
    if (answers.length > 0) void mdns.respond(answers);
  });
  const announce = () => {
    void mdns.respond(records());
  };
  announce();
  const repeat = setTimeout(announce, repeatMs);
  repeat.unref();
  return {
    announce,
    stop: async () => {
      clearTimeout(repeat);
      await mdns.respond(records().map((record) => ({ ...record, ttl: 0 })));
      await mdns.close();
    },
  };
};

export { startMdnsAdvertiser };
