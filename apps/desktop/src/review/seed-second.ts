/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { REVIEW_PORT, REVIEW_SECOND } from './review.constants';
import { saveReviewTemplate } from './save-review-template';

const seedSecond = (): Promise<SessionTemplate | null> => saveReviewTemplate(REVIEW_SECOND, (base) => ({ ...base, host: { kind: 'local', port: REVIEW_PORT + 2 } }));

export { seedSecond };
