/* @layer core @kind logic */
import { requirementName } from '@archipelia/engine';

const namesOf = (packages: string[]) => [...new Set(packages.map(requirementName))];

export { namesOf };
