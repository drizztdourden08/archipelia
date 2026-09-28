/* @layer core @kind logic */
import type { RemoteLayout } from './remote-layout.type';
import { shellQuote } from './shell-quote';

const enterDir = ({ dir }: RemoteLayout) => `cd ${shellQuote(dir)} || exit 1`;

export { enterDir };
