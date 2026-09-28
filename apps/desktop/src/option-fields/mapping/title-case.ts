/* @layer renderer-app @kind logic */
const titleCase = (text: string) =>
  text.replace(/_/g, ' ').split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export { titleCase };
