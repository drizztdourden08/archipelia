/* @layer renderer-app @kind logic */
import { COUNT_TEXT } from './stage.constants';

const countLabel = (count: number): string => `${count} ${count === 1 ? COUNT_TEXT.player : COUNT_TEXT.players}`;

export { countLabel };
