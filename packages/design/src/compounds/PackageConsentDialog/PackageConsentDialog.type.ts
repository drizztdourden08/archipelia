/* @layer renderer-app @kind types */

type ConsentPackage = { name: string; version: string; url: string; direct: boolean };

type ConsentWheel = { name: string; version: string; tag: string; repo: string; sha256: string; verified: boolean; newest?: string | undefined };

type PackageConsentDialogProps = {
  title: string;
  packages: readonly ConsentPackage[];
  wheels?: readonly ConsentWheel[];
  onAccept: () => void;
  onCancel: () => void;
  onOpenLink: (url: string) => void;
};

type PackageListProps = {
  heading: string;
  packages: readonly ConsentPackage[];
  onOpenLink: (url: string) => void;
};

type WheelListProps = {
  heading: string;
  wheels: readonly ConsentWheel[];
  onOpenLink: (url: string) => void;
};

export type { ConsentPackage, ConsentWheel, PackageConsentDialogProps, PackageListProps, WheelListProps };
