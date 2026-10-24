/* @layer renderer-app @kind config */
import type { EngineChoice } from '@archipelia/model';

const REHEARSED = { latest: '0.6.9', current: '0.6.8' } as const;

const REHEARSED_CHOICE: EngineChoice = { ap: REHEARSED.latest, python: '3.12.15', pythonRelease: '20261021' };

const REHEARSED_NOTES = `https://example.test/${REHEARSED.latest}`;

export { REHEARSED, REHEARSED_CHOICE, REHEARSED_NOTES };
