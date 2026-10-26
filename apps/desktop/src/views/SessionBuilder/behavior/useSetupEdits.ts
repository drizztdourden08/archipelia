/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { DirectConnection, GeneratorSettings, ServerSettings, SessionTemplate } from '@archipelia/model';
import { DEFAULT_DIRECT } from '../SessionBuilder.constants';
import { withPort } from './with-port';
import { withoutDirect } from './without-direct';

const useSetupEdits = (setDraft: Dispatch<SetStateAction<SessionTemplate>>) => {
  const setName = useCallback((name: string) => setDraft((current) => ({ ...current, name })), [setDraft]);
  const setGenerator = useCallback((patch: Partial<GeneratorSettings>) =>
    setDraft((current) => ({ ...current, generator: { ...current.generator, ...patch } })), [setDraft]);
  const setServer = useCallback((patch: Partial<ServerSettings>) =>
    setDraft((current) => ({ ...current, server: { ...current.server, ...patch } })), [setDraft]);
  const setPort = useCallback((port: number) => setDraft((current) => ({ ...current, host: withPort(current.host, port) })), [setDraft]);
  const setDirect = useCallback((on: boolean) => setDraft((current) => (on ? { ...current, direct: { ...DEFAULT_DIRECT } } : withoutDirect(current))), [setDraft]);
  const setDirectOptions = useCallback((patch: Partial<DirectConnection>) =>
    setDraft((current) => (current.direct ? { ...current, direct: { ...current.direct, ...patch } } : current)), [setDraft]);
  return useMemo(() => ({ setDirect, setDirectOptions, setGenerator, setName, setPort, setServer }), [setDirect, setDirectOptions, setGenerator, setName, setPort, setServer]);
};

export { useSetupEdits };
