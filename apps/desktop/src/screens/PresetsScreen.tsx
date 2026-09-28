/* @layer renderer-app @kind component */
import { defineScreen } from '@drizztdourden08/brock-react';
import { PresetsHub } from '../views/PresetsHub';

const presetIdOf = (params: Record<string, unknown>) => (typeof params.presetId === 'string' ? params.presetId : undefined);

const presetsScreen = defineScreen({
  id: 'presets',
  title: 'Presets',
  group: 'library',
  render: ({ params }) => <PresetsHub presetId={presetIdOf(params)} />,
});

export { presetsScreen };
