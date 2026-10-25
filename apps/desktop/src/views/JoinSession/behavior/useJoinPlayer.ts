/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import { useKeyedGuard, usePlatform } from '@drizztdourden08/brock-react';
import { failWith } from '../../../hooks/fail-with';
import { appApi } from '../../../ipc/app-api';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { DEFAULTS_VALUE, FAILURE, YAML_EXTENSIONS, YAML_VALUE } from '../JoinSession.constants';
import type { JoinPlayerProps, PlayerDraft } from '../JoinSession.type';
import { draftProblems } from './draft-problems';
import { joinRequest } from './join-request';
import { sourceOptions } from './source-options';

const useJoinPlayer = ({ target, installed }: JoinPlayerProps) => {
  const presets = useLibraryStore((state) => state.presets);
  const loadPresets = useLibraryStore((state) => state.loadPresets);
  const { filePicker } = usePlatform();
  const { guard, isBusy, errorOf } = useKeyedGuard();
  const [draft, setDraft] = useState<PlayerDraft>({ game: '', source: DEFAULTS_VALUE, file: null, slotName: '', displayName: '' });
  const [attempted, setAttempted] = useState(false);

  useEffect(() => { void loadPresets().catch(() => undefined); }, [loadPresets]);

  const game = draft.game === '' ? (installed[0]?.game ?? '') : draft.game;
  const current = { ...draft, game };
  const problems = draftProblems(current);
  const change = (patch: Partial<PlayerDraft>) => setDraft((now) => ({ ...now, ...patch }));

  const pickFile = () => guard('file', failWith(FAILURE.file, async () => {
    const picked = await filePicker.pickFile({ extensions: YAML_EXTENSIONS });
    if (picked) change({ file: { fileName: picked.name, yaml: new TextDecoder().decode(picked.bytes) } });
  }));

  const join = () => {
    setAttempted(true);
    if (!target.ready || Object.values(problems).some((problem) => problem !== null)) return;
    void guard('join', failWith(FAILURE.join, () => appApi().joinsStart(joinRequest(target, current))));
  };

  return {
    draft: current,
    gameOptions: installed.map((entry) => ({ value: entry.game, label: entry.game })),
    sourceOptions: sourceOptions(presets, game),
    problems: attempted ? problems : { game: null, file: null, slotName: null, displayName: null },
    setGame: (value: string) => change({ game: value, source: DEFAULTS_VALUE, file: null }),
    setSource: (source: string) => {
      change({ source });
      if (source === YAML_VALUE) void pickFile();
    },
    setSlotName: (slotName: string) => change({ slotName }),
    setDisplayName: (displayName: string) => change({ displayName }),
    pickFile,
    join,
    busy: isBusy('join'),
    error: errorOf('join') ?? errorOf('file'),
  };
};

export { useJoinPlayer };
