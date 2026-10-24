/* @layer electron-main @kind logic */
import type { EngineChoice } from '@archipelia/model';
import { isRecord } from '@archipelia/model';

const isEngineChoice = (value: unknown): value is EngineChoice =>
  isRecord(value) && ['ap', 'python', 'pythonRelease'].every((key) => typeof value[key] === 'string' && value[key] !== '');

export { isEngineChoice };
