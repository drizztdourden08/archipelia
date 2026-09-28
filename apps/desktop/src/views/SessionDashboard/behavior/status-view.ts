/* @layer renderer-app @kind logic */
import type { SessionStatus } from '@archipelia/model';
import type { StatusView } from '../SessionDashboard.type';
import { STATUS_VIEW } from '../SessionDashboard.constants';

const statusView = (status: SessionStatus): StatusView => STATUS_VIEW[status];

export { statusView };
