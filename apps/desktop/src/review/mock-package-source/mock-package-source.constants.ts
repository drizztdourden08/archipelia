/* @layer renderer-app @kind config */
import type { ConsentPackage, ConsentWheel, SourceConsent } from '@archipelia/design';
import type { SourceBuildPlan, SourceCandidate, SourcePlan, SourceSuggestions, SourceToolPlan } from '@archipelia/model';

const MOCK_DELAY_MS = 450;

const MOCK_MODULE = 'ctrando';

const MOCK_TITLE = 'Chrono Trigger';

const SHA = 'a'.repeat(40);

const REPO_URL = 'https://example.test/Pseudoarc/ctrando';

const MOCK_SUGGESTIONS: SourceSuggestions = {
  module: MOCK_MODULE,
  candidates: [
    {
      id: 'Pseudoarc/ctrando', owner: 'Pseudoarc', repo: 'ctrando', url: REPO_URL, description: 'A review mock. No network is used.', stars: 48, pushedAt: '2026-10-01T00:00:00Z',
      createdAt: '2025-02-01T00:00:00Z', archived: false, fork: false, origins: ['world'], contains: true, warnings: [],
    },
    {
      id: 'copycat/ctrando', owner: 'copycat', repo: 'ctrando', url: 'https://example.test/copycat/ctrando', description: 'A review mock of a risky copy.', stars: 2, pushedAt: '2026-09-20T00:00:00Z',
      createdAt: '2026-09-01T00:00:00Z', archived: false, fork: true, origins: ['search'], contains: true, warnings: ['fork', 'few-stars'],
    },
  ] satisfies SourceCandidate[],
};

const MOCK_PLAN: SourcePlan = {
  owner: 'Pseudoarc', repo: 'ctrando', url: REPO_URL, module: MOCK_MODULE, pin: { kind: 'head', ref: 'main', sha: SHA, date: '2026-10-01T00:00:00Z' },
  python: 'C:\\Users\\review\\engine\\python.exe', command: '"C:\\Users\\review\\engine\\python.exe" -m pip install "https://example.test/archive/ctrando.tar.gz"',
  native: true, submodules: false, unsure: false, wheelState: 'none',
};

const MOCK_BUILD: SourceBuildPlan = {
  buildId: '123e4567-e89b-42d3-a456-426614174000', owner: 'Pseudoarc', repo: 'ctrando', module: MOCK_MODULE, commit: SHA, archiveSha256: 'b'.repeat(64), size: 3355443,
  confined: true, rust: false, tools: [{ name: 'setuptools', version: '80.1.0', pin: 'setuptools==80.1.0' }],
};

const MOCK_TOOL: SourceToolPlan = {
  tool: 'msvc', os: 'windows', found: 'missing', how: 'winget install --id Microsoft.VisualStudio.2022.BuildTools',
  install: {
    command: 'winget install --id Microsoft.VisualStudio.2022.BuildTools', size: 'About 4 GB', source: 'winget', elevation: 'system', restart: true,
    license: { name: 'Visual Studio licence terms', url: 'https://example.test/license' },
  },
};

const MOCK_PACKAGES: ConsentPackage[] = [{ name: 'numpy', version: '2.5.1', url: 'https://example.test/numpy', direct: false }];

const MOCK_WHEELS: ConsentWheel[] = [
  { name: MOCK_MODULE, version: '1.0.0', tag: 'main', repo: 'Pseudoarc/ctrando', sha256: 'c'.repeat(64), verified: true, built: true, commit: SHA, archiveSha256: 'b'.repeat(64) },
];

const MOCK_CONSENT: SourceConsent = { packages: MOCK_PACKAGES, wheels: MOCK_WHEELS };

const MOCK_LOG = ['Reading the build plan', 'Checking the tools', 'Running the build'];

export { MOCK_BUILD, MOCK_CONSENT, MOCK_DELAY_MS, MOCK_LOG, MOCK_MODULE, MOCK_PLAN, MOCK_SUGGESTIONS, MOCK_TITLE, MOCK_TOOL };
