/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import type { PresetCreatorParams } from '../PresetsHub.type';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { DEFAULTS } from '../PresetsHub.constants';
import { schemaFor } from './schema-for';
import { startFromOptions } from './start-from-options';
import { newPresetValues } from './new-preset-values';

const usePresetCreator = ({ installed, preferredGame, onCreated }: PresetCreatorParams) => {
  const { createPreset } = useLibraryStore();
  const [open, setOpenState] = useState(false);
  const [game, setGame] = useState('');
  const [startFrom, setStartFrom] = useState(DEFAULTS);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gameOptions = useMemo(() => installed
    .filter((entry) => schemaFor(installed, entry.game))
    .map((entry) => ({ value: entry.game, label: entry.game }))
    .sort((a, b) => a.label.localeCompare(b.label)), [installed]);
  const schema = schemaFor(installed, game);
  const startOptions = useMemo(() => startFromOptions(schema), [schema]);

  const openFor = useCallback((pick: string | undefined) => {
    setGame(pick && schemaFor(installed, pick) ? pick : gameOptions[0]?.value ?? '');
    setStartFrom(DEFAULTS);
    setError(null);
    setOpenState(true);
  }, [installed, gameOptions]);

  const setOpen = useCallback((next: boolean) => {
    if (next) openFor(preferredGame);
    else setOpenState(false);
  }, [openFor, preferredGame]);

  const pickGame = useCallback((next: string) => { setGame(next); setStartFrom(DEFAULTS); }, []);

  const create = useCallback(async (name: string) => {
    if (!schema) return false;
    setBusy(true);
    setError(null);
    try {
      const preset = await createPreset({ game, name, values: newPresetValues(schema, startFrom) });
      onCreated(preset.id);
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }, [schema, game, startFrom, createPreset, onCreated]);

  const canCreate = Boolean(schema) && !busy;

  return { canCreate, create, error, game, gameOptions, open, openFor, pickGame, setOpen, setStartFrom, startFrom, startOptions };
};

export { usePresetCreator };
