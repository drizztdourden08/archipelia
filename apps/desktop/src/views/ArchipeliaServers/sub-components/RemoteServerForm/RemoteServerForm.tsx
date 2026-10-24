/* @layer renderer-app @kind component */
import { useState } from 'react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Stack } from '@drizztdourden08/tessera/primitives';
import { EMPTY_DRAFT } from '../../ArchipeliaServers.constants';
import { draftProblems } from '../../behavior/draft-problems';
import { serverFormRows } from '../../behavior/server-form-rows';
import type { ServerDraft } from '../../ArchipeliaServers.type';
import type { RemoteServerFormProps } from './RemoteServerForm.type';

const RemoteServerForm = ({ onAdd, onClose }: RemoteServerFormProps) => {
  const [draft, setDraft] = useState<ServerDraft>(EMPTY_DRAFT);
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const problems = draftProblems(draft);

  const add = () => {
    setAttempted(true);
    if (problems.length > 0) return;
    setBusy(true);
    void onAdd(draft).then((added) => {
      setBusy(false);
      if (added) onClose();
    });
  };

  return (
    <Stack gap="sm">
      <SettingsSection id="add-server" title="Add a server" rows={serverFormRows(draft, attempted ? problems : [], setDraft)} compact />
      <ButtonRow>
        <Button variant="primary" loading={busy} onClick={add}>Add server</Button>
        <Button variant="secondary" disabled={busy} onClick={onClose}>Cancel</Button>
      </ButtonRow>
    </Stack>
  );
};

export { RemoteServerForm };
