/* @layer core @kind config */
import type { SourceBuildTool, SourceToolOs } from '@archipelia/model';
import type { ImmutableFamily, PackageManager, ToolKey } from './tool.type';

const MIB = 1024 * 1024;

const WINGET_ID = 'Microsoft.VisualStudio.2022.BuildTools';

const VS_SWITCHES = ['--quiet', '--wait', '--norestart', '--add', 'Microsoft.VisualStudio.Workload.VCTools', '--includeRecommended'] as const;

const WINGET_ARGS = ['install', '--id', WINGET_ID, '-e', '--accept-package-agreements', '--accept-source-agreements', '--override', VS_SWITCHES.join(' ')] as const;

const WINGET_PATH = ['Microsoft', 'WindowsApps', 'winget.exe'] as const;

const VS_BOOTSTRAPPER_URL = 'https://aka.ms/vs/17/release/vs_BuildTools.exe';

const VS_BOOTSTRAPPER_NAME = 'vs_BuildTools.exe';

const VS_HOSTS = ['aka.ms', 'download.visualstudio.microsoft.com', 'visualstudio.microsoft.com'] as const;

const VS_MAX_BYTES = 16 * MIB;

const VSWHERE_PATH = ['Microsoft Visual Studio', 'Installer', 'vswhere.exe'] as const;

const VSWHERE_ARGS = ['-latest', '-products', '*', '-requires', 'Microsoft.VisualStudio.Component.VC.Tools.x86.x64', '-property', 'installationPath'] as const;

const POWERSHELL_PATH = ['System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'] as const;

const SIGNATURE_VAR = 'ARCHIPELIA_CHECK';

const SIGNATURE_SCRIPT = `$s = Get-AuthenticodeSignature -LiteralPath $env:${SIGNATURE_VAR}; if ($s.Status -eq 'Valid' -and $s.SignerCertificate.Subject -like '*O=Microsoft Corporation*') { 'valid' } else { 'invalid' }`;

const SIGNATURE_ARGS = ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', SIGNATURE_SCRIPT] as const;

const RUSTUP_ROOT = 'https://static.rust-lang.org/rustup/dist';

const RUSTUP_HOSTS = ['static.rust-lang.org'] as const;

const RUSTUP_MAX_BYTES = 64 * MIB;

const RUSTUP_ARGS = ['-y', '--no-modify-path', '--profile', 'minimal'] as const;

const RUSTUP_TRIPLES: Readonly<Record<string, string>> = {
  'win32:x64': 'x86_64-pc-windows-msvc',
  'win32:arm64': 'aarch64-pc-windows-msvc',
  'linux:x64': 'x86_64-unknown-linux-gnu',
  'linux:arm64': 'aarch64-unknown-linux-gnu',
  'darwin:x64': 'x86_64-apple-darwin',
  'darwin:arm64': 'aarch64-apple-darwin',
};

const RUST_FOLDERS = { cargo: 'cargo', rustup: 'rustup' } as const;

const INSTALLER_DIR = 'installers';

const PKEXEC = '/usr/bin/pkexec';

const XCODE_SELECT = '/usr/bin/xcode-select';

const PACKAGE_COMMANDS: Readonly<Record<PackageManager, { file: string; gcc: readonly string[]; cmake: readonly string[]; shown: string }>> = {
  apt: { file: '/usr/bin/apt-get', gcc: ['install', '-y', 'build-essential'], cmake: ['install', '-y', 'cmake'], shown: 'sudo apt-get' },
  dnf: { file: '/usr/bin/dnf', gcc: ['install', '-y', 'gcc', 'gcc-c++', 'make'], cmake: ['install', '-y', 'cmake'], shown: 'sudo dnf' },
  pacman: { file: '/usr/bin/pacman', gcc: ['-S', '--needed', '--noconfirm', 'base-devel'], cmake: ['-S', '--needed', '--noconfirm', 'cmake'], shown: 'sudo pacman' },
  zypper: { file: '/usr/bin/zypper', gcc: ['--non-interactive', 'install', 'gcc', 'gcc-c++', 'make'], cmake: ['--non-interactive', 'install', 'cmake'], shown: 'sudo zypper' },
};

const MANAGER_BY_ID: Readonly<Record<string, PackageManager>> = {
  debian: 'apt', ubuntu: 'apt', fedora: 'dnf', rhel: 'dnf', centos: 'dnf', rocky: 'dnf', almalinux: 'dnf', arch: 'pacman', manjaro: 'pacman', suse: 'zypper', opensuse: 'zypper', sles: 'zypper',
};

const IMMUTABLE_VARIANTS = ['silverblue', 'kinoite', 'sericea', 'onyx', 'coreos', 'iot', 'atomic', 'microos'] as const;

const OSTREE_MARKER = '/run/ostree-booted';

const OS_RELEASE_FILE = '/etc/os-release';

const CC_CANDIDATES = ['/usr/bin/cc', '/usr/bin/gcc', '/usr/bin/clang'] as const;

const PROBE_TIMEOUT_MS = 15000;

const DOWNLOAD_TIMEOUT_MS = 10 * 60 * 1000;

const MAX_HOPS = 5;

const CHECKSUM_MAX_BYTES = 4096;

const RESTART_CODE = 3010;

const CMAKE_PACKAGE = 'cmake';

const MAX_COMMAND_CHARS = 2000;

const SHA256_PATTERN = /\b[0-9a-f]{64}\b/i;

const DRIVE_PATH = /^[A-Za-z]:\\/;

const EXECUTABLE = 0o755;

const PROGRAM_FILES_X86 = 'C:\\Program Files (x86)';

const MSVC_BY_HAND = 'Download vs_BuildTools.exe from the Visual Studio Build Tools page, run it and tick Desktop development with C++.';

const OS_OF: Partial<Record<NodeJS.Platform, SourceToolOs>> = { win32: 'windows', darwin: 'mac', linux: 'linux' };

const WINGET_HOWS: Readonly<Record<string, string>> = { rust: 'winget install --id Rustlang.Rustup -e', cmake: 'winget install --id Kitware.CMake -e' };

const RUST_UNIX_HOW = 'curl --proto \'=https\' --tlsv1.2 -sSf https://sh.rustup.rs | sh';

const IMMUTABLE_HOWS: Readonly<Record<ImmutableFamily, string>> = {
  steamos: 'sudo steamos-readonly disable\nsudo pacman-key --init\nsudo pacman-key --populate archlinux\nsudo pacman -S --needed base-devel\nsudo steamos-readonly enable',
  nixos: 'nix-shell -p gcc gnumake',
  ostree: 'rpm-ostree install gcc gcc-c++ make',
};

const TOOL_KEYS: Readonly<Record<SourceBuildTool, Partial<Record<NodeJS.Platform, ToolKey>>>> = {
  msvc: { win32: 'msvc' },
  compiler: { win32: 'msvc', darwin: 'xcode', linux: 'gcc' },
  xcode: { darwin: 'xcode' },
  rust: { win32: 'rust', darwin: 'rust', linux: 'rust' },
  cmake: { win32: 'cmake', darwin: 'cmake', linux: 'cmake' },
  'python-headers': {},
  headers: {},
};

const SOURCE_BUILD_TOOLS: readonly SourceBuildTool[] = ['msvc', 'compiler', 'xcode', 'python-headers', 'headers', 'rust', 'cmake'];

export {
  CC_CANDIDATES, CHECKSUM_MAX_BYTES, CMAKE_PACKAGE, DOWNLOAD_TIMEOUT_MS, DRIVE_PATH, EXECUTABLE, MAX_COMMAND_CHARS, MSVC_BY_HAND, OS_OF, PROGRAM_FILES_X86, SHA256_PATTERN, IMMUTABLE_HOWS, IMMUTABLE_VARIANTS, INSTALLER_DIR, MANAGER_BY_ID, MAX_HOPS, OS_RELEASE_FILE, OSTREE_MARKER, PACKAGE_COMMANDS, PKEXEC, POWERSHELL_PATH, PROBE_TIMEOUT_MS,
  RESTART_CODE, RUST_FOLDERS, RUST_UNIX_HOW, RUSTUP_ARGS, RUSTUP_HOSTS, RUSTUP_MAX_BYTES, RUSTUP_ROOT, RUSTUP_TRIPLES, SIGNATURE_ARGS, SIGNATURE_VAR, SOURCE_BUILD_TOOLS, TOOL_KEYS, VS_BOOTSTRAPPER_NAME,
  VS_BOOTSTRAPPER_URL, VS_HOSTS, VS_MAX_BYTES, VS_SWITCHES, VSWHERE_ARGS, VSWHERE_PATH, WINGET_ARGS, WINGET_HOWS, WINGET_PATH, XCODE_SELECT,
};
