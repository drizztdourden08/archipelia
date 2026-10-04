/* @layer renderer-app @kind logic */
import { PORT_RANGE } from '../ServerOptionsForm.constants';

const inPortRange = (port: number): boolean => Number.isInteger(port) && port >= PORT_RANGE.min && port <= PORT_RANGE.max;

export { inPortRange };
