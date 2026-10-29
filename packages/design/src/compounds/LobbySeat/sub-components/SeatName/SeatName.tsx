/* @layer renderer-app @kind component */
import { Pressable, Text, Title } from '@drizztdourden08/tessera/primitives';
import type { SeatNameProps } from './SeatName.type';

const SeatName = ({ name, meta, onOpen }: SeatNameProps) => (
  <>
    <Title level={3} className="lobby-seat__name">
      {onOpen ? <Pressable className="lobby-seat__open" onClick={onOpen}>{name}</Pressable> : name}
    </Title>
    {meta.map((line) => <Text key={line} as="span" variant="caption" tone="dim" className="lobby-seat__meta">{line}</Text>)}
  </>
);

export { SeatName };
