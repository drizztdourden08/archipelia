/* @layer core @kind logic */
import type { MdnsQuestion, MdnsRecord } from '../ports/network-ports.type';
import { PTR_TTL_SECONDS, SERVICE_DOMAIN, SERVICE_ENUMERATION } from './network-discovery.constants';

const matches = (question: MdnsQuestion, record: MdnsRecord): boolean =>
  question.name.toLowerCase() === record.name.toLowerCase() && (question.type === 'ANY' || question.type === record.type);

const wantsService = (question: MdnsQuestion): boolean =>
  question.name.toLowerCase() === SERVICE_DOMAIN && (question.type === 'PTR' || question.type === 'ANY');

const answerOne = (question: MdnsQuestion, records: MdnsRecord[]): MdnsRecord[] => {
  if (wantsService(question)) return records;
  if (question.name.toLowerCase() === SERVICE_ENUMERATION && question.type === 'PTR') {
    return [{ name: SERVICE_ENUMERATION, type: 'PTR', ttl: PTR_TTL_SECONDS, flush: false, data: SERVICE_DOMAIN }];
  }
  return records.filter((record) => matches(question, record));
};

const answerMdnsQueries = (questions: MdnsQuestion[], records: MdnsRecord[]): MdnsRecord[] => [
  ...new Set(questions.flatMap((question) => answerOne(question, records))),
];

export { answerMdnsQueries };
