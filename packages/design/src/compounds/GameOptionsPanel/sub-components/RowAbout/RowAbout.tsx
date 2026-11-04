/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import type { RowAboutProps } from './RowAbout.type';

const RowAbout = ({ row }: RowAboutProps) => (
  <>
    {row.description && <Text as="span" variant="caption" className="game-option-row__about">{row.description}</Text>}
    {row.facts.length > 0 && (
      <Text as="span" variant="caption" tone="muted" className="game-option-row__facts">
        {row.facts.map((fact) => `${fact.term}: ${fact.text}`).join(' · ')}
      </Text>
    )}
    {row.hint && <Text as="span" variant="caption" tone="muted" className="game-option-row__facts">{row.hint}</Text>}
  </>
);

export { RowAbout };
