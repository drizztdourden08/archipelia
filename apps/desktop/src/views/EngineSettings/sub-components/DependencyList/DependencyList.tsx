/* @layer renderer-app @kind component */
import { CodeBlock } from '@drizztdourden08/tessera/composites';
import { Disclosure, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ruleText } from '../../behavior/rule-text';
import type { DependencyListProps } from './DependencyList.type';

const DependencyList = ({ packages, rules }: DependencyListProps) => (
  <Disclosure size="sm" summary={`${packages.length} packages`}>
    <Stack gap="xs">
      {rules.map((rule) => <Text key={ruleText(rule)} variant="caption">{`The app ${ruleText(rule)}.`}</Text>)}
      {packages.length > 0 && <CodeBlock code={packages.join('\n')} language="text" copyable capped />}
    </Stack>
  </Disclosure>
);

export { DependencyList };
