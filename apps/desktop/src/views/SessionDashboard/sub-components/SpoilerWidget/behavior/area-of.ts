/* @layer renderer-app @kind logic */
import { AREA_SPLIT } from '../SpoilerWidget.constants';

const areaOf = (location: string): string | null => AREA_SPLIT.exec(location)?.[1] ?? null;

export { areaOf };
