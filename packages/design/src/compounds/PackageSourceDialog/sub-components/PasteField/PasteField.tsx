/* @layer renderer-app @kind component */
import { Button, Field, Flex, Icon, TextInput } from '@drizztdourden08/tessera/primitives';
import { useState } from 'react';
import { SOURCE_TEXT } from '../../PackageSourceDialog.constants';
import type { PasteFieldProps } from './PasteField.type';

const PasteField = ({ failed, looking, onPaste }: PasteFieldProps) => {
  const [text, setText] = useState('');
  const ready = text.trim() !== '';
  return (
    <Flex align="end" gap="md" wrap>
      <Field label={SOURCE_TEXT.pasteHeading} error={failed ? SOURCE_TEXT.pasteFailed : undefined} width="full">
        <TextInput value={text} placeholder={SOURCE_TEXT.pastePlaceholder} onChange={(event) => setText(event.target.value)} onEnter={(value) => value.trim() !== '' && onPaste(value)} />
      </Field>
      <Button variant="secondary" icon={<Icon name="search" />} disabled={!ready} loading={looking} onClick={() => onPaste(text)}>{SOURCE_TEXT.pasteAction}</Button>
    </Flex>
  );
};

export { PasteField };
