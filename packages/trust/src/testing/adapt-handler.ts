/* @layer testing @kind logic */
import type { MockHandler } from './adapt-handler.type';

const adaptHandler = (handler: MockHandler) => async (_uri: string, body: unknown): Promise<[number, string, Record<string, string>]> => {
  const result = await handler.fn(typeof body === 'string' ? body : JSON.stringify(body));
  const text = typeof result.response === 'string' ? result.response : Buffer.from(result.response.buffer).toString('utf8');
  return [result.statusCode, text, { 'Content-Type': result.contentType ?? 'text/plain' }];
};

export { adaptHandler };
