/* @layer core @kind logic */
import { NEXT_LINK, SEARCH_URL } from './ready.constants';

const nextLink = (header: string | null): string | undefined => {
  const url = header === null ? undefined : NEXT_LINK.exec(header)?.[1];
  return url?.startsWith(`${SEARCH_URL}?`) ? url : undefined;
};

export { nextLink };
