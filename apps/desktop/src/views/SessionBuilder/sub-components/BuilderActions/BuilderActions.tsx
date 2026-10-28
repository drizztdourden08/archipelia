/* @layer renderer-app @kind component */
import { useId } from 'react';
import { Button, ButtonRow, Flex, Text } from '@drizztdourden08/tessera/primitives';
import { buttonReason } from '../../behavior/button-reason';
import { buttonVariant } from '../../behavior/button-variant';
import { BUTTON_LABEL } from '../../SessionBuilder.constants';
import type { BuilderActionsProps } from './BuilderActions.type';

const BuilderActions = ({ buttons, busy, reasons, on }: BuilderActionsProps) => {
  const reasonId = useId();
  const first = buttons[0];
  const shown = first ? buttonReason(first, reasons) : undefined;
  return (
    <Flex gap="sm" align="center" wrap>
      {shown && <Text id={reasonId} variant="caption" tone="dim">{shown}</Text>}
      <ButtonRow>
        {buttons.map((id, index) => {
          const reason = buttonReason(id, reasons);
          return (
            <Button key={id} variant={buttonVariant(id, index)} disabled={busy || reason !== undefined} aria-describedby={reason ? reasonId : undefined} onClick={on[id]}>
              {BUTTON_LABEL[id]}
            </Button>
          );
        })}
      </ButtonRow>
    </Flex>
  );
};

export { BuilderActions };
