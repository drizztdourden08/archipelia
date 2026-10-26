/* @layer renderer-app @kind component */
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { Button, Callout, Flex, Stack } from '@drizztdourden08/tessera/primitives';
import { BACKABLE_STEPS, SOURCE_TEXT } from './PackageSourceDialog.constants';
import type { PackageSourceDialogProps } from './PackageSourceDialog.type';
import { SourceBody } from './sub-components/SourceBody';
import './PackageSourceDialog.css';

const PackageSourceDialog = (props: PackageSourceDialogProps) => {
  const { module, step, onBack, onClose } = props;
  return (
    <DialogShell
      open
      size="lg"
      onClose={onClose}
      title={SOURCE_TEXT.title(module)}
      actions={(
        <Flex gap="sm" justify="end" wrap>
          {BACKABLE_STEPS.has(step.kind) && <Button variant="secondary" onClick={onBack}>{SOURCE_TEXT.back}</Button>}
          <Button variant="secondary" onClick={onClose}>{SOURCE_TEXT.close}</Button>
        </Flex>
      )}
    >
      <Stack gap="md">
        <Callout tone="warning">{SOURCE_TEXT.warning(module)}</Callout>
        <SourceBody {...props} />
      </Stack>
    </DialogShell>
  );
};

export { PackageSourceDialog };
