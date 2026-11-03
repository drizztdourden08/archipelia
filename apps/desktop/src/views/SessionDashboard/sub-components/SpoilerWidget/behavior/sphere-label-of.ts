/* @layer renderer-app @kind logic */
import { NO_SPHERE } from '../SpoilerWidget.constants';

const sphereLabelOf = (sphere: number | null): string => (sphere === null ? NO_SPHERE : `Sphere ${sphere}`);

export { sphereLabelOf };
