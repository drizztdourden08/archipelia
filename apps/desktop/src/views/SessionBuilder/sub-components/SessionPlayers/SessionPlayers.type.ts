/* @layer renderer-app @kind types */
import type { useSessionBuilder } from '../../behavior/useSessionBuilder';

type SessionPlayersProps = { builder: ReturnType<typeof useSessionBuilder> };

export type { SessionPlayersProps };
