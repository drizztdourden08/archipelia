/* @layer core @kind logic */
import type { DiscoveredWorld, WorldTrust } from '@archipelia/model';
import { NOT_REVIEWED } from './first-party.constants';

const notReviewedTrust = ({ repo }: DiscoveredWorld): WorldTrust => ({ state: 'unverified', detail: `${NOT_REVIEWED}: ${repo}` });

export { notReviewedTrust };
