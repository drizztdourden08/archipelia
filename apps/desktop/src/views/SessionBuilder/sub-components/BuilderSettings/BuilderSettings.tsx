/* @layer renderer-app @kind component */
import { ServerOptionsForm } from '@archipelia/design';
import { DirectConnection } from '../../../DirectConnection';
import type { BuilderSettingsProps } from './BuilderSettings.type';

const BuilderSettings = ({ builder }: BuilderSettingsProps) => {
  const { draft } = builder;
  return (
    <>
      <ServerOptionsForm
        generator={draft.generator}
        server={draft.server}
        host={draft.host}
        serverOptions={builder.serverOptions}
        password={builder.password}
        hasPassword={Boolean(draft.server.passwordRef)}
        onGenerator={builder.setGenerator}
        onServer={builder.setServer}
        onHostKind={builder.setHostKind}
        onPort={builder.setPort}
        onRemoteServer={builder.setRemoteServer}
        onPassword={builder.setPassword}
        onClearPassword={builder.clearPassword}
      />
      <DirectConnection
        templateId={draft.id}
        direct={draft.direct}
        busy={builder.busy}
        onEnable={builder.direct.enable}
        onDisable={builder.direct.disable}
        onOptions={builder.direct.setOptions}
        onServer={builder.direct.moveTo}
      />
    </>
  );
};

export { BuilderSettings };
