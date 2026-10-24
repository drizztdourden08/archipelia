/* @layer core @kind logic */
import makeMdns from 'multicast-dns';
import type { MdnsPort } from './network-ports.type';
import { MDNS_MAX_RECORDS } from './mdns-limits.constants';
import { readMdnsRecords } from './read-mdns-records';

const createNodeMdns = (): MdnsPort => {
  const mdns = makeMdns({ reuseAddr: true });
  return {
    onQuery: (handler) => {
      mdns.on('query', (packet) => handler(packet.questions.slice(0, MDNS_MAX_RECORDS).map(({ name, type }) => ({ name, type }))));
    },
    onRecords: (handler) => {
      mdns.on('response', (packet, from) => handler(readMdnsRecords(packet), from.address));
    },
    onError: (handler) => {
      mdns.on('error', handler);
      mdns.on('warning', handler);
    },
    query: (name) => mdns.query({ questions: [{ name, type: 'PTR' }] }),
    respond: (records) => new Promise<void>((done) => {
      mdns.respond({ answers: records }, () => done());
    }),
    close: () => new Promise<void>((done) => {
      try {
        mdns.destroy(() => done());
      } catch {
        done();
      }
    }),
  };
};

export { createNodeMdns };
