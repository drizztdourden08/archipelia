/* @layer tests @kind config */
import { join } from 'node:path';

const PROOF_DIR = process.env.PROOF_DIR
  ?? 'C:/Users/drizz/AppData/Local/Temp/claude/X--relic-of-the-past/3e40cb40-b776-4e8f-ad27-a78003ca6153/scratchpad/proof/app';

const LOCAL_PORT = 38297;
const PROFILE = 'E2E tester';
const TEMPLATE = 'E2E multiworld';

const SOH = { game: 'Ship of Harkinian', card: 'Ocarina of Time: Ship of Harkinian', preset: 'SoH e2e', toggle: 'Lock Overworld Doors', slot: 'Link' };
const TIMESPINNER = { game: 'Timespinner', card: 'Timespinner', preset: 'Timespinner e2e', choice: 'Boss Randomization', value: 'Scaled', slot: 'Lunais' };

const exportPath = (userData: string, name: string) => join(userData, 'exports', name);

export { exportPath, LOCAL_PORT, PROFILE, PROOF_DIR, SOH, TEMPLATE, TIMESPINNER };
