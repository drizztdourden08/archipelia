/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { GameCard } from '@archipelia/design';
import { useEffect, useRef } from 'react';
import { cardPropsOf } from '../../behavior/card-props';
import { enrichKey } from '../../behavior/enrich-key';
import { enrichProps } from '../../behavior/enrich-props';
import { useEnrichStore } from '../../behavior/useEnrichStore';
import { useSeen } from '../../behavior/useSeen';
import type { GameRowCardProps } from './GameRowCard.type';

const GameRowCard = ({ row, handlers }: GameRowCardProps) => {
  const holder = useRef<HTMLElement>(null);
  const seen = useSeen(holder);
  const { apworld, source } = row.entry;
  const found = useEnrichStore((state) => state.found[enrichKey({ apworld, source })]);
  const ask = useEnrichStore((state) => state.ask);
  useEffect(() => {
    if (seen) ask({ apworld, source });
  }, [seen, ask, apworld, source]);

  return (
    <Box ref={holder} className="game-store__anchor">
      <GameCard {...cardPropsOf(row, handlers)} {...enrichProps(found)} />
    </Box>
  );
};

export { GameRowCard };
