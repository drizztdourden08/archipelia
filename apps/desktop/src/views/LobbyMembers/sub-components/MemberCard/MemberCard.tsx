/* @layer renderer-app @kind component */
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import { Card, Inline, Stack, Status, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { MEMBER_ADMISSIONS } from '../../../../lobbies/lobby-statuses.constants';
import { clientFacts } from '../../behavior/member-facts';
import { memberActions } from '../../behavior/member-actions';
import { memberLine } from '../../behavior/member-line';
import { pendingWorlds } from '../../behavior/pending-worlds';
import { trustTag } from '../../behavior/trust-tag';
import { MemberButtons } from '../MemberButtons';
import { SlotLine } from '../SlotLine';
import type { MemberCardProps } from './MemberCard.type';

const MemberCard = ({ lobby, member, model }: MemberCardProps) => {
  const can = memberActions(lobby, member);
  const tag = trustTag(member);
  const worlds = pendingWorlds(lobby, member);
  const actions = can.refuse || can.approve || can.remove ? <MemberButtons lobby={lobby} member={member} model={model} /> : undefined;
  return (
    <Card title={member.displayName} subtitle={memberLine(member)} actions={actions} level={3}>
      <Stack gap="sm">
        <Inline gap="sm" align="center" wrap>
          <Status map={MEMBER_ADMISSIONS} value={member.admission} dot />
          {member.kind === 'client' && <Tag variant="urgency" color={tag.color} title={tag.title}>{tag.text}</Tag>}
          {member.ready && <Tag color="primary">Ready</Tag>}
          {member.reason && <Text variant="caption" tone="dim">{member.reason}</Text>}
        </Inline>
        {member.client && <FactsPanel label={`${member.displayName} client`} groups={[clientFacts(member)]} layout="inline" />}
        {member.slots.map((slot) => (
          <SlotLine key={slot.name} slot={slot} consent={worlds.find((request) => request.slot.name === slot.name)} busy={model.isBusy()} onReview={model.review} />
        ))}
      </Stack>
    </Card>
  );
};

export { MemberCard };
