/* @layer renderer-app @kind logic */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import { formatBytes } from '@drizztdourden08/brock-core/format';
import type { ConsentRequest } from '../LobbyDetail.type';
import { memberLine } from './member-line';

const consentOptions = ({ member, world }: ConsentRequest, where: string): ConfirmActionOptions => ({
  title: 'Allow this world?',
  message: `This world was not published by a listed client. Archipelia will run its Python code on ${where} with your user rights. Allow it only if you trust ${member.displayName}.`,
  confirmLabel: 'Allow this world',
  cancelLabel: 'Refuse',
  variant: 'danger',
  facts: [
    { label: 'Game', value: world.game },
    { label: 'World version', value: world.worldVersion },
    { label: 'Size', value: formatBytes(world.size) },
    { label: 'Hash', value: world.sha256 },
    { label: 'Sent by', value: member.displayName },
    { label: 'Client', value: memberLine(member) },
    { label: 'Check', value: world.trust.detail },
  ],
});

export { consentOptions };
