/* @layer renderer-app @kind hook */
import { useEffect, useRef, useState } from 'react';
import { formatJson } from './format-json';
import type { JsonProblem, JsonShape, JsonText } from './json-text.type';
import { readJsonText } from './read-json-text';

const useJsonText = (value: unknown, onChange: (next: unknown) => void, shape: JsonShape): JsonText => {
  const shown = formatJson(value);
  const [text, setText] = useState(shown);
  const [problem, setProblem] = useState<JsonProblem | null>(null);
  const sent = useRef(shown);

  useEffect(() => {
    if (shown === sent.current) return;
    sent.current = shown;
    setText(shown);
    setProblem(null);
  }, [shown]);

  const edit = (next: string): void => {
    setText(next);
    const read = readJsonText(next, shape);
    setProblem(read.problem);
    if (read.problem !== null) return;
    const tidy = formatJson(read.value);
    if (tidy === sent.current) return;
    sent.current = tidy;
    onChange(read.value);
  };

  return { text, edit, problem };
};

export { useJsonText };
