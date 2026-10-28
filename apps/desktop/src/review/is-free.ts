/* @layer renderer-app @kind logic */
const isFree = (element: HTMLElement | null): element is HTMLElement =>
  element !== null && !element.hasAttribute('disabled') && element.getAttribute('aria-disabled') !== 'true';

export { isFree };
