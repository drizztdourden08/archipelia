/* @layer core @kind config */
import type { SourceBuildTool } from '@archipelia/model';
import type { ZipLimits } from '@archipelia/model/zip';

const MIB = 1024 * 1024;

const MAX_ARCHIVE_BYTES = 250 * MIB;

const ARCHIVE_LIMITS: ZipLimits = { entries: 20_000, entryBytes: 128 * MIB, totalBytes: 800 * MIB };

const ARCHIVE_TIMEOUT_MS = 10 * 60 * 1000;

const BUILD_PREFIX = 'archipelia-build-';

const STALE_BUILD_MS = 24 * 60 * 60 * 1000;

const ARCHIVE_FILE = 'source.zip';

const PYPROJECT = 'pyproject.toml';

const DEFAULT_REQUIRES = ['setuptools>=40.8.0', 'wheel'];

const MAX_REQUIRES = 40;

const MAX_LOG_LINES = 200;

const MAX_TOOLS = 200;

const BUILD_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const RESERVED_NAMES = new Set([
  'con', 'prn', 'aux', 'nul', 'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9', 'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9',
]);

const FAILURE_RULES: readonly { tool: SourceBuildTool; pattern: RegExp }[] = [
  { tool: 'python-headers', pattern: /Python\.h\b[^\n]*(?:No such file|not found)|Cannot open include file:\s*'Python\.h'|cannot find Python\.h/i },
  {
    tool: 'msvc',
    pattern: /Microsoft Visual C\+\+ [\d.]+ or greater is required|Unable to find vcvarsall\.bat|could not find any instance of Visual Studio|command '(?:[^']*[\\/])?cl(?:\.exe)?' failed(?! with exit)|'cl' is not recognized/i,
  },
  { tool: 'xcode', pattern: /xcrun: error: invalid active developer path|xcode-select: error|no developer tools were found/i },
  {
    tool: 'rust',
    pattern: /can't find Rust compiler|(?:cargo|rustc)(?:\.exe)?['"]?:? (?:command )?not found|'(?:cargo|rustc)' is not recognized|No such file or directory[^\n]*['"](?:cargo|rustc)['"]|Cargo, the Rust package manager, is not installed/i,
  },
  { tool: 'cmake', pattern: /CMake must be installed|cmake: (?:command )?not found|'cmake' is not recognized|No such file or directory[^\n]*['"]cmake['"]|Could not find CMake/i },
  {
    tool: 'compiler',
    pattern: /command '[^']*(?:gcc|cc|clang|g\+\+|c\+\+)' failed(?! with exit)|unable to execute '[^']*(?:gcc|cc|clang|g\+\+)'|\b(?:gcc|cc|clang|g\+\+): (?:command )?not found|No CMAKE_C(?:XX)?_COMPILER could be found|no acceptable C compiler found|error: could not find a C compiler/i,
  },
];

const HEADER_FILE = /fatal error: ([\w./+-]+\.h): No such file or directory/i;

export {
  ARCHIVE_FILE, ARCHIVE_LIMITS, ARCHIVE_TIMEOUT_MS, BUILD_ID, BUILD_PREFIX, DEFAULT_REQUIRES, FAILURE_RULES, HEADER_FILE, MAX_ARCHIVE_BYTES, MAX_LOG_LINES, MAX_REQUIRES,
  MAX_TOOLS, PYPROJECT, RESERVED_NAMES, STALE_BUILD_MS,
};
