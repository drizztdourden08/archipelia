/* @layer renderer-app @kind logic */
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { MockPackageSource } from '../mock-package-source';
import type { MountedWizard } from './package-wizard.type';

const mountWizard = (): MountedWizard => {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    root.unmount();
    host.remove();
  };
  root.render(createElement(MockPackageSource, { onClose: close }));
  return { close, closed: () => closed };
};

export { mountWizard };
