/* @layer root-config @kind config */
import { defineBrockVitestConfig } from '@drizztdourden08/brock-build/vitest';

export default defineBrockVitestConfig(import.meta.dirname, {}, { appDir: 'apps/desktop' });
