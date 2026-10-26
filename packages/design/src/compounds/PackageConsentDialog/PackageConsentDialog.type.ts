/* @layer renderer-app @kind types */

type ConsentPackage = { name: string; version: string; url: string; direct: boolean };

type PackageConsentDialogProps = {
  title: string;
  packages: readonly ConsentPackage[];
  onAccept: () => void;
  onCancel: () => void;
  onOpenLink: (url: string) => void;
};

type PackageListProps = {
  heading: string;
  packages: readonly ConsentPackage[];
  onOpenLink: (url: string) => void;
};

export type { ConsentPackage, PackageConsentDialogProps, PackageListProps };
