/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Flex, Toggle } from '@drizztdourden08/tessera/primitives';
import { DIRECT_TEXT } from '../../behavior/place.constants';
import type { DirectTogglesProps } from './DirectToggles.type';

const DirectToggles = ({ state, onAllow, onOptions }: DirectTogglesProps) => {
  const approve = useCallback((on: boolean) => onOptions({ admission: on ? 'host-approval' : 'open' }), [onOptions]);
  const unlisted = useCallback((allowUnlisted: boolean) => onOptions({ allowUnlisted }), [onOptions]);
  return (
    <Flex gap="lg" wrap align="center">
      <Toggle label={DIRECT_TEXT.allow.title} help={DIRECT_TEXT.allow.description} checked={state.on} disabled={state.allowOff} onChange={onAllow} />
      <Toggle
        label={DIRECT_TEXT.approval.title}
        help={`${DIRECT_TEXT.approval.description} ${DIRECT_TEXT.approval.hint}`}
        checked={state.on && state.approval}
        disabled={state.optionsOff}
        onChange={approve}
      />
      <Toggle
        label={DIRECT_TEXT.unlisted.title}
        help={`${DIRECT_TEXT.unlisted.description} ${DIRECT_TEXT.unlisted.hint}`}
        checked={state.unlisted}
        disabled={state.optionsOff}
        onChange={unlisted}
      />
    </Flex>
  );
};

export { DirectToggles };
