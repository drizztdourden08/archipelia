/* @layer renderer-app @kind types */
import type { OptionValue } from '@archipelia/model';

type JsonShape = 'object' | 'list';

type JsonParse = { value: OptionValue; error?: undefined } | { value?: undefined; error: string };

export type { JsonParse, JsonShape };
