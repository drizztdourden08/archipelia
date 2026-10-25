/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { blocksOf } from '../src/enrich/blocks-of';
import { clampText } from '../src/enrich/clamp-text';
import { introOf } from '../src/enrich/intro-of';
import { stripInline } from '../src/enrich/strip-inline';

const README = `<!-- hidden note -->
<p align="center"><img src="logo.png"></p>

# Timespinner Archipelago

[![Build](https://img.shields.io/badge.svg)](https://ci.example.com) [![Discord](https://img.shields.io/d.svg)](https://discord.gg/x)

> **Note** This is a quote and not the description.

A **randomizer** world for [Timespinner](https://example.com/ts), with \`items\`
and <b>locations</b> shuffled across time.
<script>alert(1)</script>

## Installation

Copy the apworld into your custom_worlds folder and restart everything you have open.

\`\`\`bash
pip install nothing
\`\`\`
`;

describe('stripInline', () => {
  test('drops images, badges, tags and comments but keeps the words', () => {
    expect(stripInline('![logo](a.png) Hello [world](https://x.y) <b>bold</b> <!-- c --> `code` &amp; more')).toBe('Hello world bold code & more');
  });

  test('never leaves markup that could be rendered', () => {
    const text = stripInline('<img src=x onerror=alert(1)>text<script>bad()</script>');
    expect(text).not.toContain('<');
    expect(text).toContain('text');
  });
});

describe('README to description', () => {
  const intro = introOf(blocksOf(README));

  test('the summary is the first prose paragraph as plain text', () => {
    expect(intro.summary).toBe('A randomizer world for Timespinner, with items and locations shuffled across time.');
  });

  test('the details leave out installation sections and code', () => {
    expect(intro.details).toContain('Timespinner Archipelago');
    expect(intro.details).not.toContain('custom_worlds');
    expect(intro.details).not.toContain('pip install');
  });

  test('a README with only badges and a quote has no description', () => {
    expect(introOf(blocksOf('# X\n\n[![a](b.svg)](c)\n\n> only a quote that is quite long\n'))).toEqual({});
  });

  test('a setext title is a heading, not the description', () => {
    expect(introOf(blocksOf('Cool Game\n=========\n\nA short but real description of the game.\n')).summary).toBe('A short but real description of the game.');
  });
});

describe('clampText', () => {
  test('keeps whole sentences when it can, else cuts at a word', () => {
    expect(clampText('One short sentence here. Another sentence that runs on and on.', 40)).toBe('One short sentence here.');
    expect(clampText('word '.repeat(100).trim(), 22)).toBe('word word word word...');
    expect(clampText('short', 40)).toBe('short');
  });
});
