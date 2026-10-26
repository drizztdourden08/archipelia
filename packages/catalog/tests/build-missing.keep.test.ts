/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { classifyBuildFailure } from '../src/build/classify-build-failure';

const log = (...tail: string[]) => ['Building wheel for ctrando (pyproject.toml): started', 'running build_ext', ...tail, 'ERROR: Failed building wheel for ctrando'];

describe('what a failed build says is missing', () => {
  test.each([
    ['Microsoft Visual C++ on Windows', 'error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/', 'msvc'],
    ['vcvarsall.bat', 'error: Unable to find vcvarsall.bat', 'msvc'],
    ['cl.exe that cannot start', "error: command 'cl.exe' failed: None", 'msvc'],
    ['gcc that cannot start', "error: command 'gcc' failed: No such file or directory", 'compiler'],
    ['gcc as the message stands', "error: command 'gcc' failed", 'compiler'],
    ['a full path to gcc', "error: command '/usr/bin/x86_64-linux-gnu-gcc' failed: No such file or directory", 'compiler'],
    ['cc that cannot start', "error: command 'cc' failed: No such file or directory", 'compiler'],
    ['clang that cannot start', "error: command 'clang' failed: No such file or directory", 'compiler'],
    ['unable to execute gcc', "error: unable to execute 'gcc': No such file or directory", 'compiler'],
    ['a shell that cannot find cc', '/bin/sh: 1: cc: not found', 'compiler'],
    ['CMake without a compiler', 'CMake Error at CMakeLists.txt:2 (project):\n  No CMAKE_C_COMPILER could be found.', 'compiler'],
    ['Xcode tools', 'xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun', 'xcode'],
    ['Python.h on Linux', 'src/ctrando/compression/compress.c:1:10: fatal error: Python.h: No such file or directory', 'python-headers'],
    ['Python.h on Windows', "compress.c(1): fatal error C1083: Cannot open include file: 'Python.h': No such file or directory", 'python-headers'],
    ['Rust that setuptools-rust cannot find', "error: can't find Rust compiler\n\nIf you are using an outdated pip version, it is possible a prebuilt wheel is available.", 'rust'],
    ['cargo that cannot start', "FileNotFoundError: [Errno 2] No such file or directory: 'cargo'", 'rust'],
    ['cargo on Windows', "'cargo' is not recognized as an internal or external command, operable program or batch file.", 'rust'],
    ['rustc in a shell', 'sh: rustc: command not found', 'rust'],
    ['CMake in scikit-build', 'CMake must be installed to build the following extensions: ctrando', 'cmake'],
    ['CMake in a shell', '/bin/sh: cmake: command not found', 'cmake'],
    ['CMake that cannot start', "FileNotFoundError: [Errno 2] No such file or directory: 'cmake'", 'cmake'],
    ['CMake on Windows', "'cmake' is not recognized as an internal or external command", 'cmake'],
  ])('%s', (_label, line, tool) => {
    expect(classifyBuildFailure(log(line))).toEqual({ tool });
  });

  test('names the header file when a system library header is missing', () => {
    expect(classifyBuildFailure(log('src/ffi_glue.c:3:10: fatal error: ffi.h: No such file or directory'))).toEqual({ tool: 'headers', detail: 'ffi.h' });
    expect(classifyBuildFailure(log('fatal error: openssl/ssl.h: No such file or directory'))).toEqual({ tool: 'headers', detail: 'openssl/ssl.h' });
  });

  test('prefers the Python headers over the compiler that reports them', () => {
    expect(classifyBuildFailure(log('fatal error: Python.h: No such file or directory', 'compilation terminated.', "error: command '/usr/bin/gcc' failed with exit code 1"))).toEqual({ tool: 'python-headers' });
  });

  test('does not call a compile error a missing compiler', () => {
    expect(classifyBuildFailure(log("error: command '/usr/bin/gcc' failed with exit code 1"))).toBeUndefined();
    expect(classifyBuildFailure(log("error: command 'gcc' failed with exit status 1"))).toBeUndefined();
    expect(classifyBuildFailure(log("error: command 'cl.exe' failed with exit code 2"))).toBeUndefined();
  });

  test('says nothing for a failure it does not know', () => {
    expect(classifyBuildFailure(log("ModuleNotFoundError: No module named 'numpy'"))).toBeUndefined();
    expect(classifyBuildFailure(log('error: subprocess-exited-with-error'))).toBeUndefined();
    expect(classifyBuildFailure([])).toBeUndefined();
  });
});
