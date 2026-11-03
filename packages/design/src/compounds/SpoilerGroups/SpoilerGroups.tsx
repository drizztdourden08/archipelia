/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { GroupTree } from '@drizztdourden08/tessera/composites';
import type { TreeNode } from '@drizztdourden08/tessera/composites';
import type { SpoilerBatch, SpoilerGroup, SpoilerGroupsProps } from './SpoilerGroups.type';
import { GroupCounts } from './sub-components/GroupCounts';
import { SpoilerRowList } from './sub-components/SpoilerRowList';
import './SpoilerGroups.css';

const toTreeNode = (group: SpoilerGroup): TreeNode<SpoilerBatch> => ({
  key: group.key,
  label: group.label,
  meta: <GroupCounts counts={group.counts} />,
  children: group.children.map(toTreeNode),
  items: group.rows.length > 0 ? [{ key: `${group.key}/rows`, rows: group.rows }] : [],
});

const batchKey = (batch: SpoilerBatch) => batch.key;

const SpoilerGroups = ({ root, view, expanded, onExpandedChange, label, emptyLabel }: SpoilerGroupsProps) => {
  const tree = useMemo(() => toTreeNode(root), [root]);
  const renderItem = useCallback((batch: SpoilerBatch) => <SpoilerRowList key={batch.key} rows={batch.rows} view={view} />, [view]);
  return (
    <Box className="spoiler-groups">
      <GroupTree
        root={tree}
        label={label}
        getItemKey={batchKey}
        renderItem={renderItem}
        showCounts={false}
        emptyLabel={emptyLabel}
        expandedKeys={expanded}
        onExpandedChange={onExpandedChange}
      />
    </Box>
  );
};

export { SpoilerGroups };
