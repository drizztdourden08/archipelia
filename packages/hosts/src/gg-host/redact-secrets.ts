/* @layer core @kind logic */
import { RULES } from './redact-secrets.constants';

const redactSecrets = (line: string) => RULES.reduce((text, [pattern, into]) => text.replace(pattern, into), line);

export { redactSecrets };
