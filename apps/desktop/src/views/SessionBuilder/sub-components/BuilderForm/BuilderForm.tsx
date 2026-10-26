/* @layer renderer-app @kind component */
import { Callout, Grid, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout, ServerOptionsForm } from '@archipelia/design';
import { SESSION_FAILED } from '../../../../hooks/lobby-hooks.constants';
import type { BuilderFormProps } from './BuilderForm.type';
import { useSessionBuilder } from '../../behavior/useSessionBuilder';
import { BuilderHeader } from '../BuilderHeader';
import { JoinCard } from '../JoinCard';
import { BUILDER_COLUMN_MIN, SETUP_TEXT } from '../../SessionBuilder.constants';

const BuilderForm = ({ initial }: BuilderFormProps) => {
  const builder = useSessionBuilder(initial);
  const { draft } = builder;
  return (
    <Stack>
      <BuilderHeader name={draft.name} saved={builder.saved} busy={builder.busy} action={builder.action} onName={builder.setName} onSave={builder.save} />
      {builder.dataFailed && <ErrorCallout message={SESSION_FAILED.data} onRetry={builder.reloadData} />}
      {builder.error && <ErrorCallout message={builder.error} />}
      {builder.live && <Callout tone="info">{SETUP_TEXT.live}</Callout>}
      <Grid minColWidth={BUILDER_COLUMN_MIN} fit gap="md">
        <JoinCard builder={builder} />
        <ServerOptionsForm generator={draft.generator} server={draft.server} onGenerator={builder.setGenerator} onServer={builder.setServer} />
      </Grid>
    </Stack>
  );
};

export { BuilderForm };
