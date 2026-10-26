/* @layer core @kind config */

const URL_REQUIREMENT = /^(?:([A-Za-z0-9][A-Za-z0-9._-]*)\s*@\s*)?(?:[A-Za-z]+\+)?(?:https?|ssh|git):\/\/(\S+)/i;

const EGG = /[#&]egg=([A-Za-z0-9][A-Za-z0-9._-]*)/;

const HOST_HOME = /^(?:[^@/]+@)?(?:www\.)?github\.com[/:]/i;

const REPO_PATH = /^([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/@#?].*)?$/;

export { EGG, HOST_HOME, REPO_PATH, URL_REQUIREMENT };
