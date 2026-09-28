/* @layer core @kind logic */

const fromSuuid = (suuid: string) => {
  const hex = Buffer.from(suuid, 'base64url').toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export { fromSuuid };
