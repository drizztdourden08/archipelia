/* @layer core @kind config */

const PIP_FLAGS = ['--isolated', '--disable-pip-version-check', '--no-warn-script-location', '--no-input', '--only-binary=:all:'];

const PIP_ERROR = /^ERROR:\s*/;

const PIN = /^[a-z0-9]+(?:-[a-z0-9]+)*==[A-Za-z0-9.+!_-]+$/;

export { PIN, PIP_ERROR, PIP_FLAGS };
