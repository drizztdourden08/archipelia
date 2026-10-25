/* @layer renderer-app @kind types */
import type { SlotUpload } from '@archipelia/model';
import type { ConsentRequest } from '../../LobbyMembers.type';

type SlotLineProps = { slot: SlotUpload; consent?: ConsentRequest; busy: boolean; onReview: (request: ConsentRequest) => void };

export type { SlotLineProps };
