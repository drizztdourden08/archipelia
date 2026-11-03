/* @layer renderer-app @kind component */
import { Button, ButtonRow } from '@drizztdourden08/tessera/primitives';
import { buttonReason } from '../../behavior/button-reason';
import { buttonVariant } from '../../behavior/button-variant';
import { BUTTON_LABEL } from '../../SessionBuilder.constants';
import type { BuilderActionsProps } from './BuilderActions.type';

const BuilderActions = ({ buttons, busy, reasons, reasonId, on }: BuilderActionsProps) => (
  <ButtonRow gap="sm">
    {buttons.map((id, index) => ({ id, index })).reverse().map(({ id, index }) => {
      const reason = buttonReason(id, reasons);
      return (
        <Button key={id} variant={buttonVariant(id, index)} disabled={busy || reason !== undefined} aria-describedby={reason ? reasonId : undefined} onClick={on[id]}>
          {BUTTON_LABEL[id]}
        </Button>
      );
    })}
  </ButtonRow>
);

export { BuilderActions };
