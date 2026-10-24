/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';

const adminParams = (request: Record<string, unknown>) => {
  const text = (key: string): string => {
    const value = request[key];
    if (typeof value !== 'string' || value === '') throw new Error(`the request needs ${key}`);
    return value;
  };
  const maybeText = (key: string): string | undefined => (typeof request[key] === 'string' ? request[key] : undefined);
  const flag = (key: string): boolean => {
    if (typeof request[key] !== 'boolean') throw new Error(`the request needs ${key} as true or false`);
    return request[key];
  };
  const record = (key: string): Record<string, unknown> | undefined => (isRecord(request[key]) ? request[key] : undefined);
  const list = (key: string): unknown[] => (Array.isArray(request[key]) ? request[key] : []);
  return { flag, list, maybeText, record, text };
};

export { adminParams };
