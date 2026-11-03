/* @layer renderer-app @kind component */
import { sourcesOf } from '../../behavior/player-sources';
import { OverridesPanel } from '../OverridesPanel';
import type { SlotSettingsProps } from './SlotSettings.type';

const SlotSettings = ({ player, installed, presets, actions }: SlotSettingsProps) => {
  const { game, preset } = sourcesOf(player, installed, presets);
  return (
    <OverridesPanel
      plain
      player={player}
      game={game}
      preset={preset}
      onValue={actions.setOverride}
      onReset={actions.resetOverride}
      onResetAll={actions.resetAll}
    />
  );
};

export { SlotSettings };
