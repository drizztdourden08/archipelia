/* @layer renderer-app @kind component */
import { useCallback, useState } from 'react';
import { usePlayersEditor } from '../../behavior/usePlayersEditor';
import { PlayersPanel } from '../PlayersPanel';
import type { PlayersEditorProps } from './PlayersEditor.type';

const PlayersEditor = ({ draft, setDraft, installed, presets, createPreset, guard, busy }: PlayersEditorProps) => {
  const [slot, setSlot] = useState<number | null>(null);
  const actions = usePlayersEditor({ setDraft, installed, presets, createPreset, guard });
  const toggle = useCallback((picked: number) => setSlot((current) => (current === picked ? null : picked)), []);
  return (
    <PlayersPanel
      players={draft.players}
      installed={installed}
      presets={presets}
      selected={draft.players.find((player) => player.slot === slot)}
      busy={busy}
      direct={draft.direct !== undefined}
      actions={actions}
      onEdit={toggle}
    />
  );
};

export { PlayersEditor };
