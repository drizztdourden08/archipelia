/* @layer core @kind logic */

const refusedText = (label: string, line: string) =>
  `${label} lists a requirement Archipelia will not install: ${line}. Only plain package names with versions are installed.`;

export { refusedText };
