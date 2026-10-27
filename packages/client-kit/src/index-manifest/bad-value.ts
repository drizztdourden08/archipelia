/* @layer client-kit @kind logic */
import type { KitIssue } from '../errors/kit-issue.type';

const badValue = (key: string, message: string): KitIssue => ({ key, code: 'bad-value', message });

export { badValue };
