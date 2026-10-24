/* @layer core @kind logic */
import { upnpFaultCode } from './upnp-fault-code';

const describeUpnpError = (error: unknown): string => {
  const code = upnpFaultCode(error);
  const message = error instanceof Error ? error.message : String(error);
  return code === null ? message : `the router refused the mapping (UPnP error ${code}: ${message})`;
};

export { describeUpnpError };
