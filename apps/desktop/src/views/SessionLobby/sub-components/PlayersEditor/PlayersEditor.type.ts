/* @layer renderer-app @kind types */
import type { Dispatch, SetStateAction } from 'react';
import type { SessionTemplate } from '@archipelia/model';
import type { EditorDeps } from '../../SessionLobby.type';

type PlayersEditorProps = Pick<EditorDeps, 'installed' | 'presets' | 'createPreset' | 'guard'> & {
  draft: SessionTemplate;
  setDraft: Dispatch<SetStateAction<SessionTemplate>>;
  busy: boolean;
};

export type { PlayersEditorProps };
