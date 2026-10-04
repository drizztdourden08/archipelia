/* @layer renderer-app @kind logic */
import { channelApi } from '@drizztdourden08/brock-react';
import { APP_CHANNELS } from './contract.constants';

const appApi = () => channelApi(APP_CHANNELS);

export { appApi };
