/* @layer electron-main @kind logic */
import { isRecord } from '@archipelia/model';
import type { AdminMessage } from '../lobbies.type';

const parseAdminMessage = (text: string): AdminMessage | null => {
  try {
    const value: unknown = JSON.parse(text);
    return isRecord(value) && typeof value.type === 'string' ? { ...value, type: value.type } : null;
  } catch {
    return null;
  }
};

export { parseAdminMessage };
