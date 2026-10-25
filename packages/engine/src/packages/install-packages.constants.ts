/* @layer core @kind config */

const PIP_FLAGS = ['--isolated', '--disable-pip-version-check', '--no-warn-script-location', '--no-input', '--only-binary=:all:'];

const PIP_ERROR = /^ERROR:\s*/;

export { PIP_ERROR, PIP_FLAGS };
