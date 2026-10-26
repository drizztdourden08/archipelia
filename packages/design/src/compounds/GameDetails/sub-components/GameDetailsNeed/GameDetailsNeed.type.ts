/* @layer renderer-app @kind types */

type GameDetailsNeedProps = {
  message: string;
  href?: string | undefined;
  onLink?: ((href: string) => void) | undefined;
};

export type { GameDetailsNeedProps };
