/* @layer renderer-app @kind types */
import type { HostRowsInput } from '../../ServerOptionsForm.type';
import type { RoomPasswordProps } from '../RoomPassword/RoomPassword.type';

type HostFieldsProps = Omit<HostRowsInput, 'room'> & RoomPasswordProps;

export type { HostFieldsProps };
