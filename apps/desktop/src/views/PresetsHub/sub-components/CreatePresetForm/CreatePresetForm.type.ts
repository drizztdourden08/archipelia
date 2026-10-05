/* @layer renderer-app @kind types */
import type { PresetCreator } from '../../PresetsHub.type';

type CreatePresetFormProps = { creator: PresetCreator; close: () => void; onOpenGames: () => void };

export type { CreatePresetFormProps };
