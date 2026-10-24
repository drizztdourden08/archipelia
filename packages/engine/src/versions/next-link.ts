/* @layer core @kind logic */
import { NEXT_LINK } from './feed-sources.constants';

const nextLink = (header: string | null): string | undefined => (header ? NEXT_LINK.exec(header)?.[1] : undefined);

export { nextLink };
