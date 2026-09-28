/* @layer core @kind logic */

const toSuuid = (uuid: string) => Buffer.from(uuid.replaceAll('-', ''), 'hex').toString('base64url');

export { toSuuid };
