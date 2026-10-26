/* @layer renderer-app @kind logic */
import type { InstallFailure } from '@archipelia/model';
import type { CardHandlers, GameRow } from '../GameStore.type';

const needOf = ({ entry }: GameRow, handlers: CardHandlers): InstallFailure | undefined => handlers.needOf(entry.apworld);

export { needOf };
