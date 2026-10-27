/* @layer client-kit @kind config */

const USAGE = [
  'archipelia-kit: build Archipelago player YAML files and .apworld files.',
  '',
  'Commands:',
  '  build-apworld --world <dir> --out <file> --game <name> --world-version <x.y.z> --minimum-ap <x.y.z>',
  '                [--maximum-ap <x.y.z>] [--module <name>] [--data <dir>] [--author <name>]...',
  '                [--exclude <path>]... [--line-endings lf|keep]',
  '      Build one reproducible .apworld. Prints { file, module, sha256, size } as JSON.',
  '  build-set --config <file.json>',
  '      Build one .apworld per Archipelago version, the newest copy and the index manifest.',
  '  release-files --dir <release folder> [--module <name>] [--direct] [--thumbnail <image>] [--description <file.md>]',
  '      Write archipelia.json from the index in the folder, and check and copy the thumbnail and description into it.',
  '  inspect <file.apworld>',
  '      Print the archipelago.json of a built apworld with its sha256 and size.',
  '  check-fit <file.apworld> --ap <x.y.z>',
  '      Exit 0 when the world supports that exact Archipelago version, 1 when it does not.',
  '  player-yaml --input <file.json> [--schema <options.json>] [--out <file>]',
  '                [--allow-unknown] [--allow-roll] [--with-defaults]',
  '      Write an Archipelago player YAML from { game, slotName, options, description?, preRolled? }.',
  '',
  'Exit codes: 0 done, 1 the work failed or the input is not valid, 2 the command line is wrong.',
  '',
].join('\n');

const EXIT_OK = 0;
const EXIT_FAILED = 1;
const EXIT_USAGE = 2;

export { EXIT_FAILED, EXIT_OK, EXIT_USAGE, USAGE };
