/* @layer renderer-app @kind types */
import type { ServerEntry } from '@archipelia/model';
import type { DraftField, FieldErrors, SecretInputs } from '../../ServerManager.type';

type ServerFormProps = {
  entry: ServerEntry;
  inputs: SecretInputs;
  errors: FieldErrors;
  onEntry: (entry: ServerEntry) => void;
  onInputs: (inputs: SecretInputs) => void;
  onTouch: (field: DraftField) => void;
};

export type { ServerFormProps };
