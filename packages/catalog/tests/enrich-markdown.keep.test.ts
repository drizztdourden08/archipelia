/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { absoluteLink } from '../src/enrich/absolute-link';
import { absoluteLinks } from '../src/enrich/absolute-links';
import { clampDoc } from '../src/enrich/clamp-doc';
import { MAX_DOC_CHARS } from '../src/enrich/enrich.constants';
import { markdownOf } from '../src/enrich/markdown-of';

const REPO = { owner: 'someone', repo: 'ts-world' };
const BLOB = 'https://github.com/someone/ts-world/blob/HEAD';

const README = `# Timespinner Archipelago

A **randomizer** world with [setup](docs/setup.md) and [chat](https://discord.gg/x).

- first item
- second item with [guide](./GUIDE.md)

[![Build](badge.svg)](https://ci.example.com)

\`\`\`bash
see [not a link](kept/as/is.md)
\`\`\`

[ref]: docs/ref.md
`;

describe('markdownOf', () => {
  test('K1 keeps the headings, lists and emphasis as written', { tags: ['critical'] }, () => {
    const kept = markdownOf(README, REPO);
    expect(kept).toContain('# Timespinner Archipelago');
    expect(kept).toContain('- first item');
    expect(kept).toContain('**randomizer**');
  });

  test('K1 turns relative links into links on the repo and leaves absolute ones alone', { tags: ['critical'] }, () => {
    const kept = markdownOf(README, REPO);
    expect(kept).toContain(`[setup](${BLOB}/docs/setup.md)`);
    expect(kept).toContain(`[guide](${BLOB}/GUIDE.md)`);
    expect(kept).toContain(`[ref]: ${BLOB}/docs/ref.md`);
    expect(kept).toContain('[chat](https://discord.gg/x)');
    expect(kept).toContain('(https://ci.example.com)');
  });

  test('K1 leaves fenced code alone', { tags: ['critical'] }, () => {
    const kept = markdownOf(README, REPO);
    expect(kept).toContain('see [not a link](kept/as/is.md)');
  });

  test('K1 has no repo to resolve against for a world doc', { tags: ['critical'] }, () => {
    expect(markdownOf('See [options](../player-options).')).toBe('See [options](../player-options).');
  });

  test('K1 normalizes line endings and drops the byte order mark', { tags: ['critical'] }, () => {
    expect(markdownOf('﻿# Title\r\n\r\nSome text here.\r\n')).toBe('# Title\n\nSome text here.');
  });

  test('K1 has nothing to show for an empty or wordless text', { tags: ['critical'] }, () => {
    expect(markdownOf('')).toBeUndefined();
    expect(markdownOf(undefined)).toBeUndefined();
    expect(markdownOf('![](y)\n\n---\n')).toBeUndefined();
  });

  test('K1 is bounded and cut at a paragraph', { tags: ['critical'] }, () => {
    const long = `${'word '.repeat(10).trim()}\n\n`.repeat(MAX_DOC_CHARS);
    const kept = markdownOf(long) ?? '';
    expect(kept.length).toBeLessThanOrEqual(MAX_DOC_CHARS);
    expect(kept.endsWith('word')).toBe(true);
  });
});

describe('absoluteLink', () => {
  test('K1 resolves paths from the repo root and never leaves the repo', { tags: ['critical'] }, () => {
    expect(absoluteLink('/docs/a.md', REPO)).toBe(`${BLOB}/docs/a.md`);
    expect(absoluteLink('../../../../elsewhere', REPO)).toBe('https://github.com/someone/ts-world');
  });

  test('K1 keeps schemes and anchors, and gives protocol relative links https', { tags: ['critical'] }, () => {
    expect(absoluteLink('mailto:a@b.c', REPO)).toBe('mailto:a@b.c');
    expect(absoluteLink('#install', REPO)).toBe('#install');
    expect(absoluteLink('//example.com/x', REPO)).toBe('https://example.com/x');
  });
});

describe('absoluteLinks and clampDoc', () => {
  test('K1 skips tilde fences too', { tags: ['critical'] }, () => {
    expect(absoluteLinks('~~~\n[a](b.md)\n~~~\n[c](d.md)', REPO)).toBe(`~~~\n[a](b.md)\n~~~\n[c](${BLOB}/d.md)`);
  });

  test('K1 cuts at a line when there is no blank line, and keeps short text whole', { tags: ['critical'] }, () => {
    expect(clampDoc('short', 40)).toBe('short');
    expect(clampDoc(`${'a'.repeat(30)}\n${'b'.repeat(30)}`, 40)).toBe('a'.repeat(30));
  });
});
