/* @layer renderer-app @kind logic */
import { dataDomain } from '@drizztdourden08/brock-react';
import { DOMAIN } from './domains.constants';

const readRunText = async (sessionId: string, file: string): Promise<string | null> => {
  const bytes = await dataDomain(DOMAIN.sessions).readBytes(`${sessionId}/${file}`);
  return bytes && new TextDecoder().decode(bytes);
};

export { readRunText };
