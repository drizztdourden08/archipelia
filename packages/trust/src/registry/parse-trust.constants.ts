/* @layer core @kind config */

const REPO_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

const WORKFLOW_PATTERN = /^\.github\/workflows\/[A-Za-z0-9_.-]+\.ya?ml$/;

const REF_PATTERN = /^refs\/(?:heads|tags)\/\S+$/;

export { REF_PATTERN, REPO_PATTERN, WORKFLOW_PATTERN };
