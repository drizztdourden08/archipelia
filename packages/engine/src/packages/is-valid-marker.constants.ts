/* @layer core @kind config */

const TOKEN = /\s*(?:(\()|(\))|("[^"]*"|'[^']*')|(===|==|~=|!=|<=|>=|<|>)|([A-Za-z_][A-Za-z0-9_]*))/y;

const VARIABLES = new Set([
  'python_version', 'python_full_version', 'os_name', 'sys_platform', 'platform_release', 'platform_system', 'platform_version',
  'platform_machine', 'platform_python_implementation', 'implementation_name', 'implementation_version', 'extra',
]);

export { TOKEN, VARIABLES };
