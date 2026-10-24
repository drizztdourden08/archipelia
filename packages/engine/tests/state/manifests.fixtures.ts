/* @layer tests @kind test */

const LEGACY_MANIFEST = {
  apVersion: '0.6.7',
  root: '.',
  python: 'python/python.exe',
  generate: 'ap/Generate.py',
  multiServer: 'ap/MultiServer.py',
  schemaScript: 'archipelia/options_schema.py',
  official: 'official',
};

const builtManifest = (ap: string, python: string): Record<string, unknown> => ({
  ...LEGACY_MANIFEST,
  id: `ap-${ap}_py-${python}_win32-x64`,
  apVersion: ap,
  apCommit: 'a'.repeat(40),
  pythonVersion: python,
  pythonRelease: '20261021',
  target: 'win32-x64',
  builtAt: 1_700_000_000_000,
  rules: [{ skip: ['kivy'], extra: [] }],
  packages: ['requests==2.32.5'],
});

export { builtManifest, LEGACY_MANIFEST };
