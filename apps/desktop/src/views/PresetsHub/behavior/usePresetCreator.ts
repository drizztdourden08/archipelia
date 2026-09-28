/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import type { PresetCreatorParams } from '../PresetsHub.type';
import { useLibraryStore } from '../../../state/useLibraryStore';
import { DEFAULTS } from '../PresetsHub.constants';
import { schemaFor } from './schema-for';
import { startFromOptions } from './start-from-options';
import { newPresetValues } from './new-preset-values';

const usePresetCreator = ({ installed, onCreated }: PresetCreatorParams) => {
  const { createPreset } = useLibraryStore();
  const [open, setOpen] = useState(false);
  const [game, setGame] = useState('');
  const [name, setName] = useState('');
  const [startFrom, setStartFrom] = useState(DEFAULTS);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gameOptions = useMemo(() => installed
    .filter((entry) => schemaFor(installed, entry.game))
    .map((entry) => ({ value: entry.game, label: entry.game }))
    .sort((a, b) => a.label.localeCompare(b.label)), [installed]);
  const schema = schemaFor(installed, game);
  const startOptions = useMemo(() => startFromOptions(schema), [schema]);

  const openFor = useCallback((preferred?: string) => {
    setGame(preferred && schemaFor(installed, preferred) ? preferred : gameOptions[0]?.value ?? '');
    setName('');
    setStartFrom(DEFAULTS);
    setError(null);
    setOpen(true);
  }, [installed, gameOptions]);

  const close = useCallback(() => setOpen(false), []);
  const pickGame = useCallback((next: string) => { setGame(next); setStartFrom(DEFAULTS); }, []);
  const pickStart = useCallback((next: string) => {
    setStartFrom(next);
    setName((current) => (current.trim() ? current : next));
  }, []);

  const create = useCallback(async () => {
    if (!schema || !name.trim()) return;
    setBusy(true);
    try {
      const preset = await createPreset({ game, name: name.trim(), values: newPresetValues(schema, startFrom) });
      setOpen(false);
      onCreated(preset.id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }, [schema, name, game, startFrom, createPreset, onCreated]);

  const canCreate = Boolean(schema) && name.trim() !== '' && !busy;

  return { busy, canCreate, close, create, error, game, gameOptions, name, open, openFor, pickGame, pickStart, setName, startFrom, startOptions };
};

export { usePresetCreator };
