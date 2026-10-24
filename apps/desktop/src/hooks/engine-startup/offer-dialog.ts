/* @layer renderer-app @kind logic */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import { OFFER_TEXT } from './engine-startup.constants';
import type { OfferDecision } from './engine-startup.type';

const offerDialog = ({ from, to, notesUrl, choice }: OfferDecision): ConfirmActionOptions => ({
  title: OFFER_TEXT.title(to),
  message: OFFER_TEXT.message(from, choice.python),
  confirmLabel: OFFER_TEXT.confirmLabel,
  cancelLabel: OFFER_TEXT.cancelLabel,
  facts: [{ label: OFFER_TEXT.notes, value: notesUrl }],
});

export { offerDialog };
