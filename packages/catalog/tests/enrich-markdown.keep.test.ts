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
  test('keeps the headings, lists and emphasis as written', () => {
    const kept = markdownOf(README, REPO);
    expect(kept).toContain('# Timespinner Archipelago');
    expect(kept).toContain('- first item');
    expect(kept).toContain('**randomizer**');
  });

  test('turns relative links into links on the repo and leaves absolute ones alone', () => {
    const kept = markdownOf(README, REPO);
    expect(kept).toContain(`[setup](${BLOB}/docs/setup.md)`);
    expect(kept).toContain(`[guide](${BLOB}/GUIDE.md)`);
    expect(kept).toContain(`[ref]: ${BLOB}/docs/ref.md`);
    expect(kept).toContain('[chat](https://discord.gg/x)');
    expect(kept).toContain('(https://ci.example.com)');
  });

  test('leaves fenced code alone', () => {
    const kept = markdownOf(README, REPO);
    expect(kept).toContain('see [not a link](kept/as/is.md)');
  });

  test('has no repo to resolve against for a world doc', () => {
    expect(markdownOf('See [options](../player-options).')).toBe('See [options](../player-options).');
  });

  test('normalizes line endings and drops the byte order mark', () => {
    expect(markdownOf('﻿# Title\r\n\r\nSome text here.\r\n')).toBe('# Title\n\nSome text here.');
  });

  test('has nothing to show for an empty or wordless text', () => {
    expect(markdownOf('')).toBeUndefined();
    expect(markdownOf(undefined)).toBeUndefined();
    expect(markdownOf('![](y)\n\n---\n')).toBeUndefined();
  });

  test('is bounded and cut at a paragraph', () => {
    const long = `${'word '.repeat(10).trim()}\n\n`.repeat(MAX_DOC_CHARS);
    const kept = markdownOf(long) ?? '';
    expect(kept.length).toBeLessThanOrEqual(MAX_DOC_CHARS);
    expect(kept.endsWith('word')).toBe(true);
  });
});

describe('absoluteLink', () => {
  test('resolves paths from the repo root and never leaves the repo', () => {
    expect(absoluteLink('/docs/a.md', REPO)).toBe(`${BLOB}/docs/a.md`);
    expect(absoluteLink('../../../../elsewhere', REPO)).toBe('https://github.com/someone/ts-world');
  });

  test('keeps schemes and anchors, and gives protocol relative links https', () => {
    expect(absoluteLink('mailto:a@b.c', REPO)).toBe('mailto:a@b.c');
    expect(absoluteLink('#install', REPO)).toBe('#install');
    expect(absoluteLink('//example.com/x', REPO)).toBe('https://example.com/x');
  });
});

describe('absoluteLinks and clampDoc', () => {
  test('skips tilde fences too', () => {
    expect(absoluteLinks('~~~\n[a](b.md)\n~~~\n[c](d.md)', REPO)).toBe(`~~~\n[a](b.md)\n~~~\n[c](${BLOB}/d.md)`);
  });

  test('cuts at a line when there is no blank line, and keeps short text whole', () => {
    expect(clampDoc('short', 40)).toBe('short');
    expect(clampDoc(`${'a'.repeat(30)}\n${'b'.repeat(30)}`, 40)).toBe('a'.repeat(30));
  });
});
