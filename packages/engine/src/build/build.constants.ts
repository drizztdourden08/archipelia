/* @layer core @kind config */

const COMPILER_VARS = [
  'CC', 'CXX', 'CFLAGS', 'CXXFLAGS', 'CPPFLAGS', 'LDFLAGS', 'INCLUDE', 'LIB', 'LIBPATH', 'VCINSTALLDIR', 'VSINSTALLDIR', 'VCTOOLSINSTALLDIR',
  'WINDOWSSDKDIR', 'UNIVERSALCRTSDKDIR', 'DEVENVDIR', 'CARGO_HOME', 'RUSTUP_HOME', 'SDKROOT', 'DEVELOPER_DIR', 'MACOSX_DEPLOYMENT_TARGET',
] as const;

const SYSTEM_VARS = ['SYSTEMROOT', 'WINDIR', 'SYSTEMDRIVE', 'COMSPEC', 'PATHEXT', 'HOME', 'USERPROFILE'] as const;

const BUILD_ENV = {
  PIP_NO_INPUT: '1',
  PIP_DISABLE_PIP_VERSION_CHECK: '1',
  PYTHONUTF8: '1',
  PYTHONUNBUFFERED: '1',
  PYTHONNOUSERSITE: '1',
} as const;

const SCRATCH_VARS = ['TEMP', 'TMP', 'TMPDIR'] as const;

const PYTHON_FLAGS = ['-X', 'utf8', '-I'] as const;

const BUILD_PIP_FLAGS = ['--isolated', '--disable-pip-version-check', '--no-input', '--no-cache-dir'] as const;

const INSTALL_ONLY_FLAGS = ['--no-warn-script-location'] as const;

export { BUILD_ENV, BUILD_PIP_FLAGS, COMPILER_VARS, INSTALL_ONLY_FLAGS, PYTHON_FLAGS, SCRATCH_VARS, SYSTEM_VARS };
