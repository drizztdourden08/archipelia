/* @layer protocol @kind config */

const CLOSE_CODES = {
  badMessage: 4400,
  protocolUnsupported: 4401,
  forbidden: 4403,
  notFound: 4404,
  versionConflict: 4409,
  lobbyEnded: 4410,
  resumeReplaced: 4412,
  rateLimited: 4429,
} as const;

export { CLOSE_CODES };
