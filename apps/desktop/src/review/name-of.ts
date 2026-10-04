/* @layer renderer-app @kind logic */
const squash = (text: string | null | undefined): string => (text ?? '').replace(/\s+/g, ' ').trim();

const labelledBy = (el: HTMLElement): string | null => {
  const ids = el.getAttribute('aria-labelledby');
  return ids ? squash(ids.split(' ').map((id) => document.getElementById(id)?.textContent ?? '').join(' ')) : null;
};

const nameOf = (el: HTMLElement): string => {
  const label = el.getAttribute('aria-label');
  if (label) return squash(label);
  const linked = labelledBy(el);
  if (linked) return linked;
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return squash(el.labels?.[0]?.textContent) || squash(el.placeholder);
  return squash(el.innerText || el.textContent);
};

export { nameOf };
