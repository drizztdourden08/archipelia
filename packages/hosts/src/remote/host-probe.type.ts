/* @layer core @kind types */

type HostProbe = {
  apPath: string;
  python: string;
  pythonVersion: string;
  multiServer: boolean;
  apVersion: string;
  systemd: boolean;
  linger: boolean;
  portFree?: boolean;
};

export type { HostProbe };
