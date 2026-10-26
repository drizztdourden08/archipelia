/* @layer renderer-app @kind component */
import { DialogShell, Markdown } from '@drizztdourden08/tessera/composites';
import { Flex, Stack, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { GAME_STATUS } from '../GameCard/GameCard.constants';
import { ErrorCallout } from '../ErrorCallout';
import { LOADING_DESCRIPTION, NO_DESCRIPTION, README_HEADING_OFFSET } from './GameDetails.constants';
import type { GameDetailsProps } from './GameDetails.type';
import { GameDetailsActions } from './sub-components/GameDetailsActions';
import { GameDetailsMedia } from './sub-components/GameDetailsMedia';
import { GameDetailsNeed } from './sub-components/GameDetailsNeed';
import { GameDetailsNotes } from './sub-components/GameDetailsNotes';
import './GameDetails.css';

const GameDetails = (props: GameDetailsProps) => {
  const { title, kind, kindLabel, version, status, notes, tags, actions, markdown, art, busy, error, need, loading, onLink, onClose } = props;
  return (
    <DialogShell open onClose={onClose} title={title} size="lg" actions={<GameDetailsActions actions={actions} busy={busy} />}>
      <Stack gap="md">
        <Flex align="center" gap="md">
          <GameDetailsMedia kind={kind} kindLabel={kindLabel} art={art} />
          <Stack gap="xs">
            <Text>{kindLabel}</Text>
            <Flex align="center" gap="sm" wrap>
              {version && <Text variant="caption" mono numeric>{version}</Text>}
              {status && <Tag>{GAME_STATUS[status].label}</Tag>}
            </Flex>
          </Stack>
        </Flex>
        {error && <ErrorCallout message={error} />}
        {need && <GameDetailsNeed message={need.message} href={need.href} onLink={onLink} />}
        {markdown
          ? <Markdown source={markdown} size="sm" headingOffset={README_HEADING_OFFSET} hideTitle onLink={onLink} />
          : <Text tone="dim">{loading ? LOADING_DESCRIPTION : NO_DESCRIPTION}</Text>}
        {notes.length > 0 && <GameDetailsNotes notes={notes} />}
        {tags.length > 0 && <Flex gap="xs" wrap>{tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</Flex>}
      </Stack>
    </DialogShell>
  );
};

export { GameDetails };
