/* @layer core @kind logic */

const pickDocName = (names: string[], game: string): string | undefined => {
  const docs = names.filter((name) => /^en_[^/]+\.md$/i.test(name)).sort();
  return docs.find((name) => name.toLowerCase() === `en_${game}.md`.toLowerCase()) ?? docs[0];
};

export { pickDocName };
