/* @layer tests @kind data */
const MODULE_UPDATE_0_6_0 = `import os
import sys
import subprocess
import multiprocessing
import warnings


if sys.platform in ("win32", "darwin") and sys.version_info < (3, 10, 11):
    # Official micro version updates.
    raise RuntimeError(f"Incompatible Python Version found: {sys.version_info}. Official 3.10.15+ is supported.")
elif sys.platform in ("win32", "darwin") and sys.version_info < (3, 10, 15):
    # There are known security issues, but no easy way to install fixed versions on Windows for testing.
    warnings.warn(f"Python Version {sys.version_info} has security issues. Don't use in production.")
elif sys.version_info < (3, 10, 1):
    # Other platforms may get security backports instead of micro updates, so the number is unreliable.
    raise RuntimeError(f"Incompatible Python Version found: {sys.version_info}. 3.10.1+ is supported.")

# don't run update if environment is frozen/compiled or if not the parent process (skip in subprocess)
_skip_update = bool(getattr(sys, "frozen", False) or multiprocessing.parent_process())
update_ran = _skip_update
`;

const MODULE_UPDATE_0_6_8 = `import os
import sys
import subprocess
import multiprocessing
import warnings


if sys.platform in ("win32", "darwin") and not (3, 11, 9) <= sys.version_info < (3, 14, 0):
    # Official micro version updates.
    raise RuntimeError(f"Incompatible Python Version found: {sys.version_info}. "
                       "Official 3.11.9 through 3.13.x is supported.")
elif sys.platform in ("win32", "darwin") and sys.version_info < (3, 11, 13):
    # There are known security issues, but no easy way to install fixed versions on Windows for testing.
    warnings.warn(f"Python Version {sys.version_info} has security issues. Don't use in production.")
elif not (3, 11, 0) <= sys.version_info < (3, 14, 0):
    # Other platforms may get security backports instead of micro updates, so the number is unreliable.
    raise RuntimeError(f"Incompatible Python Version found: {sys.version_info}. 3.11.0 through 3.13.x is supported.")

# don't run update if environment is frozen/compiled or if not the parent process (skip in subprocess)
_skip_update = bool(
    getattr(sys, "frozen", False) or
    multiprocessing.parent_process() or
    os.environ.get("SKIP_REQUIREMENTS_UPDATE", "").lower() in ("1", "true", "yes")
)
update_ran = _skip_update
`;

export { MODULE_UPDATE_0_6_0, MODULE_UPDATE_0_6_8 };
