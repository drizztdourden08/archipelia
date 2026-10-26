/* @layer renderer-app @kind component */
import { GameDetails } from '@archipelia/design';
import { useEffect } from 'react';
import { artOf } from '../../behavior/art-of';
import { busyOf } from '../../behavior/busy-of';
import { busyText } from '../../behavior/busy-text';
import { cardPropsOf } from '../../behavior/card-props';
import { enrichKey } from '../../behavior/enrich-key';
import { failureOf } from '../../behavior/failure-of';
import { needOf } from '../../behavior/need-of';
import { needProps } from '../../behavior/need-props';
import { textOf } from '../../behavior/text-of';
import { useEnrichStore } from '../../behavior/useEnrichStore';
import type { GameDetailsDialogProps } from './GameDetailsDialog.type';

const GameDetailsDialog = ({ row, handlers, onClose }: GameDetailsDialogProps) => {
  const { apworld, source, displayName } = row.entry;
  const found = useEnrichStore((state) => state.found[enrichKey({ apworld, source })]);
  const ask = useEnrichStore((state) => state.ask);
  useEffect(() => ask({ apworld, source }), [ask, apworld, source]);

  const busy = busyOf(row, handlers);
  const need = needOf(row, handlers);
  const error = need ? undefined : failureOf(row, handlers);
  return (
    <GameDetails
      {...cardPropsOf(row, handlers)}
      {...artOf(found)}
      {...textOf(found)}
      {...needProps(need)}
      {...(busy ? { busy: busyText(busy, displayName) } : {})}
      {...(error ? { error } : {})}
      loading={found === undefined}
      onLink={handlers.openHome}
      onClose={onClose}
    />
  );
};

export { GameDetailsDialog };
