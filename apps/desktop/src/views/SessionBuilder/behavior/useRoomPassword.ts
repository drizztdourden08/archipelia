/* @layer renderer-app @kind hook */
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';
import { useCallback, useState } from 'react';
import type { SessionTemplate } from '@archipelia/model';
import { passwordNameOf } from './password-name-of';
import { withoutPassword } from './without-password';

const vault = () => {
  const api = secretsApi();
  if (!api) throw new Error('The secret vault is not available, so the room password cannot be stored');
  return api;
};

const useRoomPassword = () => {
  const [password, setPassword] = useState('');

  const commit = useCallback(async (template: SessionTemplate): Promise<SessionTemplate> => {
    if (!password) return template;
    const name = passwordNameOf(template.id);
    await vault().set(name, password, `Room password for ${template.name}`);
    setPassword('');
    return { ...template, server: { ...template.server, passwordRef: name } };
  }, [password]);

  const clear = useCallback(async (template: SessionTemplate): Promise<SessionTemplate> => {
    const ref = template.server.passwordRef;
    if (ref && ref === passwordNameOf(template.id)) await vault().delete(ref);
    setPassword('');
    return withoutPassword(template);
  }, []);

  return { clear, commit, password, setPassword };
};

export { useRoomPassword };
