/* @layer core @kind logic */
import { PORT_BOUNDS } from './port-range.constants';

const inPortRange = (port: number): boolean => Number.isInteger(port) && port >= PORT_BOUNDS.min && port <= PORT_BOUNDS.max;

export { inPortRange };
