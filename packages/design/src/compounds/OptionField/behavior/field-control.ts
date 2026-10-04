/* @layer renderer-app @kind logic */
import type { ReactNode } from 'react';
import type { OptionFieldProps } from '../OptionField.type';

const fieldControl = (children: OptionFieldProps['children'], labelId: string): ReactNode =>
  (typeof children === 'function' ? children(labelId) : children);

export { fieldControl };
