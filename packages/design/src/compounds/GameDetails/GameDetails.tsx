/* @layer renderer-app @kind component */
import { DialogShell, Markdown } from '@drizztdourden08/tessera/composites';
import { Flex, Stack, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '../ErrorCallout';
import { LOADING_DESCRIPTION, NO_DESCRIPTION, README_HEADING_OFFSET } from './GameDetails.constants';
import type { GameDetailsProps } from './GameDetails.type';
import { GameDetailsActions } from './sub-components/GameDetailsActions';
import { GameDetailsHead } from './sub-components/GameDetailsHead';
import { GameDetailsNeed } from './sub-components/GameDetailsNeed';
import { GameDetailsNotes } from './sub-components/GameDetailsNotes';
import { GameDetailsVersions } from './sub-components/GameDetailsVersions';
import './GameDetails.css';

const GameDetails = (props: GameDetailsProps) => {
  const { title, kind, kindLabel, version, status, notes, tags, actions, markdown, art, verified, direct, busy, error, need, versions, loading, onLink, onClose } = props;
  return (
    <DialogShell open onClose={onClose} title={title} size="lg" actions={<GameDetailsActions actions={actions} busy={busy} />}>
      <Stack gap="md">
        <GameDetailsHead kind={kind} kindLabel={kindLabel} art={art} version={version} verified={verified} direct={direct} status={status} />
        {error && <ErrorCallout message={error} />}
        {need && <GameDetailsNeed message={need.message} href={need.href} onLink={onLink} />}
        {versions && <GameDetailsVersions {...versions} />}
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
