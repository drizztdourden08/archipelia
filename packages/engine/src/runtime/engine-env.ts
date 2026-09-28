/* @layer core @kind logic */
const engineEnv = (): NodeJS.ProcessEnv => ({
  ...process.env,
  SKIP_REQUIREMENTS_UPDATE: '1',
  PYTHONUNBUFFERED: '1',
  PYTHONUTF8: '1',
});

export { engineEnv };
