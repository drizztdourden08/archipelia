/* @layer core @kind config */
import { PAGE_SIZE, SEARCH_QUERY, SEARCH_URL } from './ready.constants';

const FIRST_URL = `${SEARCH_URL}?q=${encodeURIComponent(SEARCH_QUERY)}&sort=updated&order=desc&per_page=${PAGE_SIZE}&page=1`;

export { FIRST_URL };
