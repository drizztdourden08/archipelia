/* @layer renderer-app @kind logic */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import { OFFER_TEXT } from './engine-startup.constants';
import type { OfferDecision } from './engine-startup.type';

const offerDialog = ({ from, to, notesUrl, choice }: OfferDecision, openNotes: (url: string) => void): ConfirmActionOptions => ({
  title: OFFER_TEXT.title(to),
  message: OFFER_TEXT.message(from, choice.python),
  confirmLabel: OFFER_TEXT.confirmLabel,
  cancelLabel: OFFER_TEXT.cancelLabel,
  alternate: { label: OFFER_TEXT.notes, onSelect: () => openNotes(notesUrl), tone: 'neutral', closes: false },
});

export { offerDialog };
