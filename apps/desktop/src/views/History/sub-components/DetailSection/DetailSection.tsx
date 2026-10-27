/* @layer renderer-app @kind component */
import { SectionHeader, Stack } from '@drizztdourden08/tessera/primitives';
import type { DetailSectionProps } from './DetailSection.type';

const DetailSection = ({ title, action, children }: DetailSectionProps) => (
  <Stack gap="sm" role="region" aria-label={title}>
    <SectionHeader title={title} level={3} action={action} />
    {children}
  </Stack>
);

export { DetailSection };
