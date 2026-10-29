/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { Flex, SegmentedControl, Select } from '@drizztdourden08/tessera/primitives';
import type { SegmentOption } from '@drizztdourden08/tessera/primitives';
import type { SessionPlace } from '../../SessionBuilder.type';
import { EDITOR_TEXT } from '../../SessionBuilder.constants';
import type { WhereControlProps } from './WhereControl.type';

const WhereControl = ({ place, busy, locked }: WhereControlProps) => {
  const segments = useMemo((): SegmentOption<SessionPlace>[] => place.options.map((option) => ({
    value: option.value as SessionPlace,
    label: option.label,
    hint: option.hint ? { label: option.label, description: option.hint } : undefined,
    disabled: option.disabled,
  })), [place.options]);
  const servers = useMemo(() => place.remoteOptions.map((option) => ({ value: option.value, label: option.label, description: option.hint, disabled: option.disabled })), [place.remoteOptions]);
  return (
    <Flex gap="sm" wrap align="center">
      <SegmentedControl aria-label={EDITOR_TEXT.where} value={place.place} options={segments} disabled={busy} onChange={place.choose} />
      {place.place === 'remote' && (
        <Select aria-label={EDITOR_TEXT.server} value={place.remoteValue} options={servers} disabled={busy || locked} onChange={place.pickRemote} />
      )}
    </Flex>
  );
};

export { WhereControl };
