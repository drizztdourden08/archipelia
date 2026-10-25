/* @layer renderer-app @kind component */
import type { ScreenMeta, SubPageProps } from '@drizztdourden08/brock-react';
import { SessionBuilder } from '../../../../views/SessionBuilder';

const meta: ScreenMeta = { title: 'Edit session', icon: 'pencil', path: ':id/edit' };

const EditSessionSub = ({ subParams }: SubPageProps) => <SessionBuilder templateId={subParams.id} />;

export default EditSessionSub;
export { meta };
