/* @layer core @kind logic */
const indexesOf = (text: string, needle: string) => {
  const found: number[] = [];
  let at = text.indexOf(needle);
  while (at >= 0) {
    found.push(at);
    at = text.indexOf(needle, at + 1);
  }
  return found;
};

export { indexesOf };
