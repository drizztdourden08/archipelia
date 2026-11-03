/* @layer renderer-app @kind types */
import type { SpoilerItemTypes, SpoilerLog } from '@archipelia/sessions/spoiler';

type SpoilerLoadedProps = { log: SpoilerLog; types: SpoilerItemTypes | null; text: string; onHide: () => void };

export type { SpoilerLoadedProps };
