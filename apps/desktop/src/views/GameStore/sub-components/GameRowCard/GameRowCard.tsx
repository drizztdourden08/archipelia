/* @layer renderer-app @kind component */
import { Box, useInView } from '@drizztdourden08/tessera/primitives';
import { GameCard } from '@archipelia/design';
import { useEffect, useRef } from 'react';
import { cardPropsOf } from '../../behavior/card-props';
import { enrichKey } from '../../behavior/enrich-key';
import { artOf } from '../../behavior/art-of';
import { useEnrichStore } from '../../behavior/useEnrichStore';
import { SEEN_DWELL_MS } from '../../GameStore.constants';
import type { GameRowCardProps } from './GameRowCard.type';

const GameRowCard = ({ row, handlers }: GameRowCardProps) => {
  const holder = useRef<HTMLElement>(null);
  const seen = useInView(holder, { dwell: SEEN_DWELL_MS, once: true });
  const { apworld, source } = row.entry;
  const found = useEnrichStore((state) => state.found[enrichKey({ apworld, source })]);
  const ask = useEnrichStore((state) => state.ask);
  useEffect(() => {
    if (seen) ask({ apworld, source });
  }, [seen, ask, apworld, source]);

  return (
    <Box ref={holder} className="game-store__anchor">
      <GameCard {...cardPropsOf(row, handlers)} {...artOf(found)} />
    </Box>
  );
};

export { GameRowCard };
