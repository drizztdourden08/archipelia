/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { Stack, Text, Toggle } from '@drizztdourden08/tessera/primitives';
import { OptionGroup, OptionRow, TagInput } from '@drizztdourden08/tessera/composites';
import type { TagValidator } from '@drizztdourden08/tessera/composites';
import { DIRECT_TEXT } from '../../behavior/place.constants';
import type { JoiningSectionProps } from './JoiningSection.type';

const JoiningSection = ({ state, installed, allowedGames, onAllow, onOptions }: JoiningSectionProps) => {
  const approve = useCallback((on: boolean) => onOptions({ admission: on ? 'host-approval' : 'open' }), [onOptions]);
  const unlisted = useCallback((allowUnlisted: boolean) => onOptions({ allowUnlisted }), [onOptions]);
  const games = useCallback((next: readonly string[]) => onOptions({ allowedGames: [...next] }), [onOptions]);
  const names = useMemo(() => [...new Set(installed.map((world) => world.game))], [installed]);
  const validate = useMemo<TagValidator>(() => (raw) => names.includes(raw) || DIRECT_TEXT.games.unknown, [names]);
  return (
    <Stack gap="xs">
      <OptionGroup title={DIRECT_TEXT.heading}>
        <OptionRow
          label={DIRECT_TEXT.allow.title}
          description={DIRECT_TEXT.allow.description}
          control={<Toggle aria-label={DIRECT_TEXT.allow.title} checked={state.on} disabled={state.allowOff} onChange={onAllow} />}
        />
        <OptionRow
          label={DIRECT_TEXT.approval.title}
          description={`${DIRECT_TEXT.approval.description} ${DIRECT_TEXT.approval.hint}`}
          control={<Toggle aria-label={DIRECT_TEXT.approval.title} checked={state.on && state.approval} disabled={state.optionsOff} onChange={approve} />}
        />
        <OptionRow
          label={DIRECT_TEXT.unlisted.title}
          description={`${DIRECT_TEXT.unlisted.description} ${DIRECT_TEXT.unlisted.hint}`}
          control={<Toggle aria-label={DIRECT_TEXT.unlisted.title} checked={state.unlisted} disabled={state.optionsOff} onChange={unlisted} />}
        />
        <OptionRow
          label={DIRECT_TEXT.games.title}
          description={DIRECT_TEXT.games.description}
          control={
            <TagInput
              aria-label={DIRECT_TEXT.games.title}
              value={allowedGames}
              suggestions={names}
              validate={validate}
              enforce
              placeholder={DIRECT_TEXT.games.placeholder}
              disabled={state.optionsOff}
              onChange={games}
            />
          }
        />
      </OptionGroup>
      {state.problem ? <Text variant="caption" tone="danger">{state.problem}</Text> : <Text variant="caption" tone="muted">{state.hint}</Text>}
    </Stack>
  );
};

export { JoiningSection };
