/* @layer core @kind logic */
import { COOKIE } from './session-cookie.constants';

const readSessionCookie = (res: Response) => {
  const hit = res.headers.getSetCookie().find((c) => c.startsWith(`${COOKIE}=`));
  return hit?.slice(COOKIE.length + 1).split(';')[0];
};

export { readSessionCookie };
