/* @layer core @kind logic */

const staleText = (label: string) =>
  `${label} or its packages changed since you reviewed them. Nothing was installed. Review its packages again.`;

export { staleText };
