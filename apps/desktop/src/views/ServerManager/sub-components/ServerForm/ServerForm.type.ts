/* @layer renderer-app @kind types */
import type { ServerEntry } from '@archipelia/model';
import type { SecretInputs } from '../../ServerManager.type';

type ServerFormProps = {
  entry: ServerEntry;
  inputs: SecretInputs;
  onEntry: (entry: ServerEntry) => void;
  onInputs: (inputs: SecretInputs) => void;
};

export type { ServerFormProps };
