/* @layer renderer-app @kind component */
import { useCallback, useMemo, useState } from 'react';
import { Button, Text } from '@drizztdourden08/tessera/primitives';
import type { OptionAboutProps } from './OptionAbout.type';
import { descriptionPreview } from '../../behavior/description-preview';

const OptionAbout = ({ label, description, hint }: OptionAboutProps) => {
  const [expanded, setExpanded] = useState(false);
  const { preview, long } = useMemo(() => descriptionPreview(description), [description]);
  const handleToggle = useCallback(() => setExpanded((open) => !open), []);
  const toggleText = expanded ? 'Less' : 'More';
  return (
    <>
      {preview && <Text className="option-field-row__description">{expanded ? description.trim() : preview}</Text>}
      {long && (
        <Button size="sm" variant="ghost" onClick={handleToggle} aria-expanded={expanded} aria-label={`${toggleText} about ${label}`}>{toggleText}</Button>
      )}
      {hint && <Text className="option-field-row__hint">{hint}</Text>}
    </>
  );
};

export { OptionAbout };
