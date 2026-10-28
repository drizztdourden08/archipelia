/* @layer renderer-app @kind types */
import type { Client } from 'archipelago.js';

type Joined = { client: Client | null; failure: string };

export type { Joined };
