/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { REVIEW_DIRECT, REVIEW_PORT } from './review.constants';
import { saveReviewTemplate } from './save-review-template';

const seedDirect = (): Promise<SessionTemplate | null> => saveReviewTemplate(REVIEW_DIRECT, (base) => ({ ...base, host: { kind: 'local', port: REVIEW_PORT + 1 } }));

export { seedDirect };
