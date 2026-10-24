/* @layer renderer-app @kind component */
import { ListItemList, ListItemRow, SettingsSection } from '@drizztdourden08/tessera/composites';
import { Button, EmptyState, Flex, Icon, IconButton, Tag } from '@drizztdourden08/tessera/primitives';
import { engineTags } from '../../behavior/engine-tags';
import { installedMeta } from '../../behavior/installed-meta';
import { whenText } from '../../behavior/when-text';
import { LIST_TEXT, SECTION_TEXT } from '../../EngineSettings.constants';
import { LIST_SHAPE } from './InstalledSection.constants';
import type { InstalledSectionProps } from './InstalledSection.type';

const InstalledSection = ({ engines, activeId, busy, onSwitch, onRemove }: InstalledSectionProps) => (
  <SettingsSection id="installed" title={SECTION_TEXT.installed.title} description={SECTION_TEXT.installed.description}>
    {engines.length === 0 ? <EmptyState size="sm" message={LIST_TEXT.empty} /> : (
      <ListItemList label={LIST_TEXT.label} count={engines.length} shape={LIST_SHAPE}>
        {engines.map((engine) => {
          const active = engine.id === activeId;
          return (
            <ListItemRow
              key={engine.id}
              name={`Archipelago ${engine.ap}`}
              meta={installedMeta(engine, whenText)}
              columns={[{ primary: <Flex gap="xs">{engineTags(engine, activeId).map(({ key, label, look, title }) => <Tag key={key} {...look} title={title}>{label}</Tag>)}</Flex> }]}
              actionVisibility="always"
              action={(
                <Flex gap="xs" align="center">
                  {!active && engine.state === 'ready' && (
                    <Button size="sm" variant="secondary" disabled={busy} onClick={() => onSwitch(engine.id)}>{LIST_TEXT.switchLabel}</Button>
                  )}
                  <IconButton size="sm" variant="ghost" tone="danger" label={`${LIST_TEXT.removeLabel} Archipelago ${engine.ap}`} disabled={busy || active} onClick={() => onRemove(engine)}>
                    <Icon name="trash-2" />
                  </IconButton>
                </Flex>
              )}
            />
          );
        })}
      </ListItemList>
    )}
  </SettingsSection>
);

export { InstalledSection };
