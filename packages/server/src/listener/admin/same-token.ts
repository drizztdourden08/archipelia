/* @layer core @kind logic */
import { createHash, timingSafeEqual } from 'node:crypto';

const digest = (text: string) => createHash('sha256').update(text).digest();

const sameToken = (given: unknown, expected: string): boolean => typeof given === 'string' && timingSafeEqual(digest(given), digest(expected));

export { sameToken };
