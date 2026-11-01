/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { distroOf } from '../src/tool/distro-of';
import { parseOsRelease } from '../src/tool/parse-os-release';
import { recipeOf } from '../src/tool/recipe-of';
import { toolPlanOf } from '../src/tool/tool-plan-of';
import { hostOf, OS_RELEASE, WINGET } from './tool.fixtures';

const TOOLS = 'C:\\Users\\me\\tools';

const NIX_TOOLS = '/home/me/tools';

const linux = (release: string, ostree = false) => hostOf(NIX_TOOLS, { platform: 'linux', release, ostree });

const recipe = (pick: ReturnType<typeof recipeOf>) => {
  if (!('recipe' in pick)) throw new Error(`blocked: ${pick.blocked}`);
  return pick.recipe;
};

describe('the Microsoft C++ Build Tools on Windows', () => {
  test('K1 use winget at its resolved path, with the override of the plan and nothing else', { tags: ['critical'] }, () => {
    const found = recipe(recipeOf('msvc', hostOf(TOOLS)));
    expect(found.kind).toBe('winget');
    expect(found.file).toBe(WINGET);
    expect(found.args).toEqual([
      'install', '--id', 'Microsoft.VisualStudio.2022.BuildTools', '-e', '--accept-package-agreements', '--accept-source-agreements',
      '--override', '--quiet --wait --norestart --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended',
    ]);
    expect(found.shown).toBe(
      `${WINGET} install --id Microsoft.VisualStudio.2022.BuildTools -e --accept-package-agreements --accept-source-agreements `
      + '--override "--quiet --wait --norestart --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"',
    );
    expect(found.elevation).toBe('system');
    expect(found.restart).toBe(true);
    expect(found.size).toMatch(/GB/);
  });

  test('K1 use the Visual Studio installer when winget is not there', { tags: ['critical'] }, () => {
    const found = recipe(recipeOf('msvc', hostOf(TOOLS, { winget: undefined })));
    expect(found.kind).toBe('bootstrapper');
    expect(found.args).toEqual(['--quiet', '--wait', '--norestart', '--add', 'Microsoft.VisualStudio.Workload.VCTools', '--includeRecommended']);
    expect(found.shown).toBe('vs_BuildTools.exe --quiet --wait --norestart --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended');
    expect(found.source).toMatch(/signature/);
  });

  test('K1 a generic missing compiler on Windows is the same install', { tags: ['critical'] }, () => {
    expect(recipe(recipeOf('compiler', hostOf(TOOLS))).shown).toBe(recipe(recipeOf('msvc', hostOf(TOOLS))).shown);
  });

  test('K1 is refused on the other systems', { tags: ['critical'] }, () => {
    expect(recipeOf('msvc', linux('ubuntu'))).toEqual({ blocked: 'unsupported' });
  });
});

describe('a C compiler on Linux, by distribution', () => {
  test.each([
    ['ubuntu', '/usr/bin/apt-get', ['install', '-y', 'build-essential']],
    ['mint', '/usr/bin/apt-get', ['install', '-y', 'build-essential']],
    ['fedora', '/usr/bin/dnf', ['install', '-y', 'gcc', 'gcc-c++', 'make']],
    ['rocky', '/usr/bin/dnf', ['install', '-y', 'gcc', 'gcc-c++', 'make']],
    ['arch', '/usr/bin/pacman', ['-S', '--needed', '--noconfirm', 'base-devel']],
    ['manjaro', '/usr/bin/pacman', ['-S', '--needed', '--noconfirm', 'base-devel']],
    ['suse', '/usr/bin/zypper', ['--non-interactive', 'install', 'gcc', 'gcc-c++', 'make']],
  ])('K1 %s runs its package manager through pkexec', { tags: ['critical'] }, (release, manager, args) => {
    const found = recipe(recipeOf('compiler', linux(release)));
    expect(found.kind).toBe('pkexec');
    expect(found.file).toBe('/usr/bin/pkexec');
    expect(found.args).toEqual([manager, ...args]);
    expect(found.elevation).toBe('system');
    expect(found.shown).toBe(['pkexec', manager, ...args].join(' '));
  });

  test('K1 shows the manual command with sudo', { tags: ['critical'] }, () => {
    expect(toolPlanOf('compiler', linux('ubuntu'), 'missing').how).toBe('sudo apt-get install -y build-essential');
    expect(toolPlanOf('compiler', linux('fedora'), 'missing').how).toBe('sudo dnf install -y gcc gcc-c++ make');
    expect(toolPlanOf('compiler', linux('arch'), 'missing').how).toBe('sudo pacman -S --needed --noconfirm base-devel');
  });

  test('K1 does not guess for a distribution it does not know', { tags: ['critical'] }, () => {
    const plan = toolPlanOf('compiler', linux('gentoo'), 'missing');
    expect(plan).toMatchObject({ blocked: 'unsupported', how: '' });
    expect(plan.install).toBeUndefined();
  });
});

describe('an immutable system', () => {
  test.each([
    ['SteamOS', 'steamos', false],
    ['NixOS', 'nixos', false],
    ['Fedora Silverblue by its variant', 'silverblue', false],
    ['Bazzite', 'bazzite', false],
    ['any Fedora booted from ostree', 'fedora', true],
  ])('K1 %s cannot install here and offers no install', { tags: ['critical'] }, (_name, release, ostree) => {
    const host = linux(release, ostree);
    expect(recipeOf('compiler', host)).toEqual({ blocked: 'immutable' });
    const plan = toolPlanOf('compiler', host, 'missing');
    expect(plan.blocked).toBe('immutable');
    expect(plan.install).toBeUndefined();
    expect(plan.how).not.toBe('');
  });

  test('K1 shows the manual way of each family', { tags: ['critical'] }, () => {
    expect(toolPlanOf('compiler', linux('steamos'), 'missing').how).toContain('steamos-readonly disable');
    expect(toolPlanOf('compiler', linux('nixos'), 'missing').how).toBe('nix-shell -p gcc gnumake');
    expect(toolPlanOf('compiler', linux('silverblue'), 'missing').how).toBe('rpm-ostree install gcc gcc-c++ make');
  });

  test('K1 does not stop the tools that need no system install', { tags: ['critical'] }, () => {
    expect('recipe' in recipeOf('cmake', linux('steamos'))).toBe(true);
    expect('recipe' in recipeOf('rust', linux('steamos'))).toBe(true);
  });
});

describe('the Xcode command line tools on macOS', () => {
  test.each(['xcode', 'compiler'] as const)('K1 %s runs xcode-select --install and nothing else', { tags: ['critical'] }, (tool) => {
    const found = recipe(recipeOf(tool, hostOf(NIX_TOOLS, { platform: 'darwin', arch: 'arm64' })));
    expect(found).toMatchObject({ kind: 'xcode', file: '/usr/bin/xcode-select', args: ['--install'], shown: 'xcode-select --install', elevation: 'system' });
  });
});

describe('Rust', () => {
  test('K1 is rustup-init with the flags of the plan, run as the user', { tags: ['critical'] }, () => {
    const found = recipe(recipeOf('rust', hostOf(TOOLS)));
    expect(found).toMatchObject({ kind: 'rustup', args: ['-y', '--no-modify-path', '--profile', 'minimal'], elevation: 'none', shown: 'rustup-init.exe -y --no-modify-path --profile minimal' });
    expect(recipe(recipeOf('rust', linux('ubuntu'))).shown).toBe('rustup-init -y --no-modify-path --profile minimal');
  });

  test('K1 is not offered where there is no rustup build', { tags: ['critical'] }, () => {
    expect(recipeOf('rust', hostOf(TOOLS, { arch: 'ia32' }))).toEqual({ blocked: 'unsupported' });
  });
});

describe('CMake', () => {
  test('K1 is a ready-made wheel for the private build folder, with no system install', { tags: ['critical'] }, () => {
    for (const host of [hostOf(TOOLS), linux('ubuntu'), hostOf(NIX_TOOLS, { platform: 'darwin' })]) {
      expect(recipe(recipeOf('cmake', host))).toMatchObject({ kind: 'pip', elevation: 'none', restart: false });
    }
  });
});

describe('what Archipelia cannot install', () => {
  test.each(['headers', 'python-headers'] as const)('K1 %s is shown, never installed', { tags: ['critical'] }, (tool) => {
    expect(recipeOf(tool, hostOf(TOOLS))).toEqual({ blocked: 'unsupported' });
    expect(toolPlanOf(tool, linux('ubuntu'), 'unknown').install).toBeUndefined();
  });
});

describe('every command comes from the table', () => {
  test('K1 the command shown is the command that runs, with the folder of the program replaced by its name', { tags: ['critical'] }, () => {
    const hosts = [hostOf(TOOLS), hostOf(TOOLS, { winget: undefined }), linux('ubuntu'), hostOf(NIX_TOOLS, { platform: 'darwin' })];
    for (const host of hosts) {
      for (const tool of ['msvc', 'compiler', 'xcode', 'rust', 'cmake'] as const) {
        const pick = recipeOf(tool, host);
        if (!('recipe' in pick)) continue;
        const rest = pick.recipe.args.map((arg) => (/\s/.test(arg) ? `"${arg}"` : arg)).join(' ');
        expect(pick.recipe.shown.endsWith(rest)).toBe(true);
      }
    }
  });

  test('K1 a program that the system runs is an absolute path', { tags: ['critical'] }, () => {
    const absolute = [recipeOf('compiler', linux('ubuntu')), recipeOf('compiler', hostOf(NIX_TOOLS, { platform: 'darwin' })), recipeOf('msvc', hostOf(TOOLS))];
    for (const pick of absolute) expect(/^(\/|[A-Za-z]:\\)/.test(recipe(pick).file)).toBe(true);
  });
});

describe('reading /etc/os-release', () => {
  test('K1 reads quoted and bare values', { tags: ['critical'] }, () => {
    expect(parseOsRelease(OS_RELEASE.ubuntu ?? '')).toMatchObject({ ID: 'ubuntu', ID_LIKE: 'debian', PRETTY_NAME: 'Ubuntu 24.04 LTS' });
  });

  test('K1 names the distribution and its package manager', { tags: ['critical'] }, () => {
    expect(distroOf(OS_RELEASE.mint ?? '', false)).toEqual({ name: 'Linux Mint', manager: 'apt', immutable: undefined });
    expect(distroOf(OS_RELEASE.steamos ?? '', false)).toMatchObject({ manager: 'pacman', immutable: 'steamos' });
    expect(distroOf('', false)).toEqual({ name: 'Linux', manager: undefined, immutable: undefined });
  });
});
