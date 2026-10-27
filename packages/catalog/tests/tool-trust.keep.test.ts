/* @layer tests @kind test */
import { writeFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';
import { parseDn } from '../src/tool/parse-dn';
import { resolveWinget } from '../src/tool/resolve-winget';
import { signatureTrusted } from '../src/tool/signature-trusted';
import { toolPlanOf } from '../src/tool/tool-plan-of';
import { toolSpecOf } from '../src/tool/tool-spec-of';
import { verifyWinget } from '../src/tool/verify-winget';
import type { Probe } from '../src/tool/tool.type';
import { answer, hostOf, probeOf, registerToolBed, SIGNED_BY_MICROSOFT, WINDOWS_ENV } from './tool.fixtures';

const POWERSHELL = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';

const lines = (...parts: string[]) => parts.join('\n');

describe('reading a distinguished name', () => {
  test('splits at the commas that are not inside quotes', () => {
    expect(parseDn('CN="a, O=Microsoft Corporation", O=Other, C=US')).toEqual({ CN: ['a, O=Microsoft Corporation'], O: ['Other'], C: ['US'] });
  });

  test('does not read a value of another field as the organisation', () => {
    expect(parseDn('OU=O=Microsoft Corporation, CN=x').O).toBeUndefined();
  });
});

describe('who signed the file', () => {
  test('is accepted for Microsoft Corporation, valid, under the Microsoft Code Signing PCA', () => {
    expect(signatureTrusted(SIGNED_BY_MICROSOFT)).toBe(true);
    expect(signatureTrusted(`${SIGNED_BY_MICROSOFT.replaceAll('\n', '\r\n')}\r\n`)).toBe(true);
    expect(signatureTrusted(SIGNED_BY_MICROSOFT.replaceAll('PCA 2011', 'PCA'))).toBe(true);
  });

  test.each([
    ['an invalid signature', SIGNED_BY_MICROSOFT.replace('status=Valid', 'status=NotSigned')],
    ['a missing signature', 'status=NotSigned'],
    ['a missing package', 'status=Missing'],
    ['an organisation that only starts like Microsoft', SIGNED_BY_MICROSOFT.replace('subject=CN=Microsoft Corporation, O=Microsoft Corporation', 'subject=CN=Microsoft Corporation, O=Microsoft Corporation Ltd')],
    ['an organisation hidden in another field', SIGNED_BY_MICROSOFT.replace('subject=CN=Microsoft Corporation, O=Microsoft Corporation', 'subject=CN=Evil, OU=O=Microsoft Corporation')],
    ['a common name that only says Microsoft', SIGNED_BY_MICROSOFT.replace('subject=CN=Microsoft Corporation, O=Microsoft Corporation', 'subject=CN=Microsoft Corporation, O=Evil')],
    ['two organisations', SIGNED_BY_MICROSOFT.replace('subject=CN=Microsoft Corporation, O=Microsoft Corporation', 'subject=O=Microsoft Corporation, O=Evil')],
    ['a chain without the Microsoft Code Signing PCA', SIGNED_BY_MICROSOFT.replace('Microsoft Code Signing PCA 2011', 'Some Code Signing PCA 2011')],
    ['a PCA that only starts like the right one', SIGNED_BY_MICROSOFT.replace('Microsoft Code Signing PCA 2011', 'Microsoft Code Signing PCA 2011 Evil')],
    ['no chain at all', lines('status=Valid', 'subject=CN=Microsoft Corporation, O=Microsoft Corporation')],
    ['two subjects', `${SIGNED_BY_MICROSOFT}\nsubject=O=Microsoft Corporation`],
    ['nothing', ''],
  ])('is refused for %s', (_name, out) => {
    expect(signatureTrusted(out)).toBe(false);
  });
});

describe('the winget that Archipelia runs elevated', () => {
  const env = { ...WINDOWS_ENV };

  test('asks Windows for the App Installer package and checks the signature of the winget inside it', async () => {
    const { probe, calls } = probeOf({ [POWERSHELL]: answer(true, SIGNED_BY_MICROSOFT) });
    expect(await verifyWinget(probe, env)).toBe(true);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.args.join(' ')).toContain('Microsoft.DesktopAppInstaller');
    expect(calls[0]?.args.join(' ')).toContain('Get-AuthenticodeSignature');
  });

  test('is the alias path when the alias exists and Microsoft signed the App Installer', async () => {
    const { probe } = probeOf({ [POWERSHELL]: answer(true, SIGNED_BY_MICROSOFT) });
    expect(await resolveWinget(env, () => Promise.resolve(true), probe)).toBe('C:\\Users\\me\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe');
  });

  test.each([
    ['a signature by someone else', answer(true, SIGNED_BY_MICROSOFT.replaceAll('Microsoft Corporation', 'Evil Corporation'))],
    ['a package that is not installed', answer(true, 'status=Missing')],
    ['a check that fails', answer(false)],
  ])('is not used after %s', async (_name, verdict) => {
    const { probe } = probeOf({ [POWERSHELL]: verdict });
    expect(await resolveWinget(env, () => Promise.resolve(true), probe)).toBeUndefined();
  });

  test('is not checked when there is no alias, and not used when PowerShell cannot be found', async () => {
    const { probe, calls } = probeOf({ [POWERSHELL]: answer(true, SIGNED_BY_MICROSOFT) });
    expect(await resolveWinget(env, () => Promise.resolve(false), probe)).toBeUndefined();
    expect(calls).toEqual([]);
    expect(await verifyWinget(probe, { SystemRoot: '\\\\server\\share' })).toBe(false);
  });

  test('is shown by its resolved path in the command the user confirms', () => {
    const plan = toolPlanOf('msvc', hostOf('C:\\tools'), 'missing');
    expect(plan.install?.command.startsWith('C:\\Users\\me\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe install ')).toBe(true);
  });
});

describe('the licence of the Build Tools', () => {
  test('is part of the plan of both ways to install them, with a link to Microsoft', () => {
    for (const winget of ['C:\\Users\\me\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe', undefined]) {
      const license = toolPlanOf('msvc', hostOf('C:\\tools', { winget }), 'missing').install?.license;
      expect(license?.name).toBe('Microsoft Visual Studio Build Tools licence');
      expect(license?.url.startsWith('https://visualstudio.microsoft.com/')).toBe(true);
    }
  });

  test('is not claimed for tools that carry none', () => {
    expect(toolPlanOf('cmake', hostOf('C:\\tools'), 'missing').install?.license).toBeUndefined();
    expect(toolPlanOf('rust', hostOf('C:\\tools'), 'missing').install?.license).toBeUndefined();
    expect(toolPlanOf('compiler', hostOf('/home/me/tools', { platform: 'linux', release: 'ubuntu' }), 'missing').install?.license).toBeUndefined();
  });
});

describe('the Visual Studio installer right before it runs', () => {
  const bed = registerToolBed();
  const FIRST = 'https://aka.ms/vs/17/release/vs_BuildTools.exe';
  const net = ((input: string | URL) => Promise.resolve(String(input) === FIRST ? new Response('vs bytes') : new Response('', { status: 404 }))) as typeof fetch;
  const noWinget = { winget: undefined };

  test('is checked again, on disk, after it was downloaded and checked', async () => {
    const { deps, host, calls } = bed.depsOf({ fetch: net, host: noWinget, answers: { [POWERSHELL]: answer(true, SIGNED_BY_MICROSOFT) } });
    const spec = await toolSpecOf(deps, 'msvc', host);
    expect(calls.filter((call) => call.file === POWERSHELL)).toHaveLength(2);
    expect(calls[1]?.env).toEqual({ ARCHIPELIA_CHECK: spec.command });
  });

  test('is refused when its signature is no longer good the second time', async () => {
    const { deps, host } = bed.depsOf({ fetch: net, host: noWinget });
    let seen = 0;
    const probe: Probe = () => {
      seen += 1;
      return Promise.resolve(answer(true, seen === 1 ? SIGNED_BY_MICROSOFT : 'status=HashMismatch'));
    };
    await expect(toolSpecOf({ ...deps, probe }, 'msvc', host)).rejects.toThrow(/signed/);
    expect(seen).toBe(2);
  });

  test('is refused when the file on disk is not the file that was downloaded', async () => {
    const { deps, host } = bed.depsOf({ fetch: net, host: noWinget });
    const probe: Probe = async (_file, _args, env) => {
      await writeFile(env?.ARCHIPELIA_CHECK ?? '', 'something else');
      return answer(true, SIGNED_BY_MICROSOFT);
    };
    await expect(toolSpecOf({ ...deps, probe }, 'msvc', host)).rejects.toThrow(/changed on disk/);
  });
});
