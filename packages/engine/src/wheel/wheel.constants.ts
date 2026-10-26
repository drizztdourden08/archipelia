/* @layer core @kind config */

const TAGS_SCRIPT = [
  'import json',
  'try:',
  '    from pip._vendor.packaging.tags import sys_tags',
  'except ImportError:',
  '    from packaging.tags import sys_tags',
  'print(json.dumps([str(tag) for tag in sys_tags()]))',
].join('\n');

const ORIGIN_SCRIPT = [
  'import sys',
  'from importlib.metadata import PackageNotFoundError, distribution',
  'try:',
  '    found = distribution(sys.argv[1])',
  'except PackageNotFoundError:',
  '    print("absent")',
  'else:',
  '    print("local" if found.read_text("direct_url.json") else "index")',
].join('\n');

const ORIGINS = ['absent', 'local', 'index'] as const;

const WHEEL_PART = /^[A-Za-z0-9_.+!]+$/;

const TAG_TRIPLE = /^[A-Za-z0-9_.]+-[A-Za-z0-9_]+-[A-Za-z0-9_.]+$/;

const METADATA_ENTRY = /^[^/]+\.dist-info\/METADATA$/;

const MAX_METADATA_BYTES = 1024 * 1024;

const MAX_TAGS = 20_000;

const EXTENSION_SUFFIX = /\.(?:so|pyd|dylib)$/;

const SAFE_FIELD = /^[A-Za-z0-9.+!_-]+$/;

const WHEEL_EXTENSION = '.whl';

export { EXTENSION_SUFFIX, MAX_METADATA_BYTES, MAX_TAGS, METADATA_ENTRY, ORIGIN_SCRIPT, ORIGINS, SAFE_FIELD, TAG_TRIPLE, TAGS_SCRIPT, WHEEL_EXTENSION, WHEEL_PART };
