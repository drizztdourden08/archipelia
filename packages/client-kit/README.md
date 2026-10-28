<!-- @layer docs @kind doc -->
# Archipelia client kit

This package is the standard tooling a client uses to make the two files an Archipelago game needs: the player YAML and the `.apworld`. A client such as Relic of the Past (RotP) imports it, so no client has to write its own YAML writer, zip builder or release index. The kit only provides tools. The client decides when and where to call them, and how to send the files to an Archipelia lobby or publish them.

The kit knows nothing about any one game. It never contains a world's Python or its game data. The client hands those in.

## Install

The package is published to GitHub Packages, like the Brock and Tessera packages. The scope must match the GitHub owner, so the name is `@drizztdourden08/archipelia-client-kit`.

1. In the client's `.npmrc`, map the scope to the registry and give it a token:

   ```ini
   @drizztdourden08:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

2. Set `NODE_AUTH_TOKEN` to a GitHub personal access token (classic) with the `read:packages` scope. In a GitHub Actions job, use the job's `GITHUB_TOKEN` and grant the job `packages: read`. Never commit the token.
3. Install it:

   ```sh
   pnpm add -D @drizztdourden08/archipelia-client-kit
   ```

The package ships built JavaScript (ES modules for Node 24 or newer) with `.d.ts` files, in `dist`. A consumer runs it with plain Node, with no build step and no type stripping. This is on purpose. Node refuses to strip types from files inside `node_modules`, and the source imports have no file extensions, so shipping TypeScript source would force every consumer to transpile it. The build is `node scripts/build.mjs` (esbuild for the JavaScript, `tsc` for the declarations). It runs by itself before `pack` and `publish`. The declarations use relative imports without extensions, so a TypeScript consumer should use `moduleResolution: "bundler"` (or `skipLibCheck`), as the Archipelia and RotP projects do. The release workflow publishes the package, not a person.

## Using the package

The package has two entry points and one command. It imports nothing from Electron or from the Archipelia app, and has one runtime dependency, `fflate` (a pure JavaScript zip library). It needs Node 24 or newer.

| Import | Holds | Needs Node |
| --- | --- | --- |
| `@drizztdourden08/archipelia-client-kit` | the YAML builder, option schema checks, the `archipelago.json` helpers, the zip writer and reader, the version rules, the index builder and parser, the `archipelia.json` release manifest, the thumbnail and description checks | no |
| `@drizztdourden08/archipelia-client-kit/node` | `buildApworld`, `buildApworldSet`, `writeReleaseFiles`, `readApworldFile`, `collectPackage`, `writeApworld`, `sha256Hex` | yes (file system, `node:crypto`) |
| `archipelia-kit` | the command line, see below | yes |

The pure entry point is safe for a renderer. The Node entry point reads and writes files and belongs to a build script or a main process. In a checkout of the Archipelia repository, `bin/archipelia-kit.mjs` runs the TypeScript source directly when `dist` does not exist.

## Player YAML

```ts
import { buildPlayerYaml, parseOptionSchema } from '@drizztdourden08/archipelia-client-kit';

const schema = parseOptionSchema(optionsJsonText);

const yaml = buildPlayerYaml({
  game: 'Relic of the Past',
  slotName: 'Link',
  description: 'Relic of the Past 0.22.0',
  schema,
  options: { death_link: false, shop_shuffle: 'random', dungeon_count: 5 },
  preRolled: { pond: { demands: [1, 2, 3] } },
});
```

`buildPlayerYaml` returns the text, ending in a newline, with the keys in this order: `name`, `description` (when given), `game`, then one block named after the game. The block holds the options in the order the caller gave them, then `pre_rolled` when `preRolled` is given. It throws a `KitError` of code `invalid-input` whose message lists every problem, one per line, and whose `issues` list holds `{ key, code, message }` for each.

| Input | Meaning |
| --- | --- |
| `game` | The game name. It must not be `name`, `game`, `description`, `requires` or `triggers`. |
| `slotName` | The slot name, written as `name`. A lobby compares it with the slot it was told about. It must not be empty, must not start or end with a space, must be at most 16 characters (Archipelago cuts longer names) and must not hold control characters, `{` or `}`. |
| `schema` | The option schema (see below). Without it, options are written as given and only the shape of the values is checked. |
| `options` | The option values. |
| `description` | An optional description line. |
| `preRolled`, `preRolledKey` | Optional values the client rolled itself. They are written under `preRolledKey` (default `pre_rolled`) inside the game block. Giving the same key in `options` too is an error. |
| `allowUnknown` | Pass options the schema does not list. Default false. |
| `allowRoll` | Allow the word `random` as the value of a toggle, choice or range, for Archipelago to roll. Default false. |
| `withDefaults` | Write the `default` of every schema row the caller left out. Default false, so Archipelago applies its own defaults. |

### The option schema

The schema is the `options.json` a world ships in its `data` folder: a list of rows.

```json
[
  { "key": "death_link", "type": "toggle", "default": false },
  { "key": "accessibility", "type": "choice", "default": "full", "numeric": false,
    "choices": [{ "value": "full", "id": 0 }, { "value": "minimal", "id": 2 }] },
  { "key": "dungeon_count", "type": "range", "default": 8, "range": { "min": 1, "max": 8 } },
  { "key": "seed_text", "type": "text", "default": "" },
  { "key": "pre_rolled", "type": "dict", "default": {} }
]
```

`parseOptionSchema` takes the parsed JSON or its text and returns typed rows, or throws `invalid-schema` naming each bad row. `validateOptions({ schema, values, allowUnknown, allowRoll, withDefaults })` returns `{ ok: true, values }` or `{ ok: false, issues }` without throwing, for a client that wants to show errors in its own screen.

| Row type | Accepted value |
| --- | --- |
| `toggle` | `true` or `false` |
| `choice` | one of the listed `value` texts (a number is accepted when it spells one). With `numeric: true` the value is written as a number. |
| `range` | a whole number from `range.min` to `range.max` |
| `text` | a text |
| `dict` | a plain object |

A choice that lists its own `random` value is written as that choice's `id`, never as the word `random`, because Archipelago reads the word as its own keyword for "roll any value". The names Archipelago adds to every world (`accessibility`, `progression_balancing`, `local_items`, `non_local_items`, `start_inventory`, `start_inventory_from_pool`, `start_hints`, `start_location_hints`, `exclude_locations`, `priority_locations`, `item_links`, `plando_items`, `plando_connections`) pass without a schema row. The issue codes are `unknown-option`, `wrong-type`, `bad-choice`, `out-of-range`, `bad-slot-name`, `bad-game`, `duplicate-value` and `bad-value`. The `locked` field of a row is read but not enforced.

### The YAML emitter

The kit has its own small block-style emitter, `emitYaml(value)`, for the subset an Archipelago file needs: nested objects, lists, texts, numbers, booleans and null. It is used instead of the `yaml` package for three reasons. The output is byte for byte stable, which a release and a test can rely on. The kit stays at one dependency. And the emitter is plain enough to audit in one sitting.

It is safe by construction. A text is written bare only when it starts with a letter or an underscore and holds nothing but letters, digits, spaces and `. / ( ) -`, and is not a word YAML 1.1 or 1.2 reads as a boolean or null, nor the word `random`. Every other text is double quoted with every control character, line separator and quote escaped. This holds for keys and values. The tests read the output back with the `yaml` package under YAML 1.1 and 1.2 for a long list of hostile texts. Values it cannot express are refused with a clear error: `NaN`, infinities, exponent numbers, bigints, dates, class instances, half a Unicode pair, and anything nested deeper than 64 levels.

## The apworld

An `.apworld` is a zip of one Python package folder, with `archipelago.json` inside it. `buildApworld` (Node) builds it from a folder on disk, plus data files the client generated:

```ts
import { buildApworld, writeApworld } from '@drizztdourden08/archipelia-client-kit/node';

const build = await buildApworld({
  worldDir: 'integrations/archipelago/relic_of_the_past',
  game: 'Relic of the Past',
  worldVersion: '0.1.0',
  minimumAp: '0.6.4',
  data: { 'options.json': optionRows, 'items.json': items },
});
await writeApworld('build/relic_of_the_past.apworld', build.bytes);
console.log(build.sha256, build.size);
```

The result is `{ module, manifest, manifestText, bytes, sha256, size }`.

| Input | Meaning |
| --- | --- |
| `worldDir` | The world's Python package folder. Its name is the module name unless `module` is given. It must hold `__init__.py`. |
| `game`, `worldVersion`, `minimumAp`, `maximumAp`, `authors`, `version`, `compatibleVersion` | The content of `archipelago.json`. See below. |
| `data` | A map of file name to content, written under `dataDir` (default `data`). A text or bytes are written as they are. Any other value is written as compact JSON followed by a newline. |
| `dataFolder` | A folder on disk whose files are added under `dataDir` too. |
| `exclude` | Paths relative to `worldDir` to leave out. |
| `lineEndings` | `lf` (default) turns CRLF into LF in text files (`.py`, `.json`, `.md`, `.txt`, `.yaml`, `.yml`, `.toml`, `.cfg`, `.ini`, `.pyi`). `keep` leaves bytes alone. |

Data from `data` or `dataFolder` replaces a file of the same path in `worldDir`. A `archipelago.json` in `worldDir` is replaced by the one the kit writes. Folders and files named `__pycache__`, `.git`, `.DS_Store` and `Thumbs.db`, and files ending `.pyc` or `.pyo`, are left out. A link inside the folder is an error.

`assembleApworld({ module, files, data, ...manifest })` does the same from files already in memory, with no file system.

### archipelago.json

The kit writes these keys, in this order, as indented JSON with a trailing newline:

```json
{
  "game": "Relic of the Past",
  "world_version": "0.1.0",
  "minimum_ap_version": "0.6.4",
  "maximum_ap_version": "0.6.8",
  "authors": ["Relic of the Past"],
  "version": 7,
  "compatible_version": 7
}
```

`maximum_ap_version` and `authors` appear only when given. `version` and `compatible_version` default to 7, the format RotP uses (`APWORLD_FORMAT_VERSION`). Versions must look like `0.6.8` (three numbers) and `world_version` like `1.2.3`. `buildArchipelagoJson` makes the text and `parseArchipelagoJson` reads it back into `{ game, worldVersion, minimumAp?, maximumAp?, authors?, version?, compatibleVersion? }`. Both throw `invalid-manifest` with a clear message.

### Reproducible zips

The same input gives the same bytes, so the same sha256, on Windows, macOS and Linux:

- Entries are sorted by path, comparing the text by code unit, not by locale.
- Every entry has the time 1980-01-01 00:00:00, written the same in any time zone.
- Every entry is a regular file with mode 0644, marked as made on Unix.
- There are no folder entries, no extra fields and no comment.
- Compression is `fflate` at level 9. It is pure JavaScript, so the result does not depend on the zlib build in the Node that runs it.
- Text files get LF line endings by default, so a Windows checkout with CRLF gives the same bytes as a Linux one.

### Reading an apworld back and the version rule

```ts
import { readApworld, checkWorldFit } from '@drizztdourden08/archipelia-client-kit';
import { readApworldFile } from '@drizztdourden08/archipelia-client-kit/node';

const { module, manifest, entries } = readApworld(bytes);
const info = await readApworldFile('relic_of_the_past.apworld');
const fit = checkWorldFit(manifest, '0.6.8');
```

`readApworld` takes bytes and `readApworldFile` takes a path (and adds `sha256` and `size`). Both need exactly one top-level folder with an `archipelago.json` in it, and throw `invalid-apworld` otherwise. Only that one small file is unpacked.

`checkWorldFit(range, archipelagoVersion)` is the lobby rule: the exact Archipelago version must be at or above `minimumAp` and, when `maximumAp` exists, at or below it. It returns `{ fits: true }` or `{ fits: false, reason, message }`, where `reason` is `too-old`, `too-new` or `invalid-version` and the message names the world and its range. `parseApVersion` and `compareApVersions` compare versions by number.

## Per-version builds and the index

A release carries one apworld per Archipelago version, and an index file naming them. `buildApworldSet` (Node) does the whole job:

```ts
import { buildApworldSet } from '@drizztdourden08/archipelia-client-kit/node';

const result = await buildApworldSet({
  game: 'Relic of the Past',
  worldVersion: '0.1.0',
  appVersion: '0.22.0',
  minimumAp: '0.6.4',
  worldDir: 'integrations/archipelago/relic_of_the_past',
  outDir: 'release',
  data: exported,
  builds: [{ archipelagoVersion: '0.6.7' }, { archipelagoVersion: '0.6.8' }],
});
```

It takes the options of `buildApworld` plus `appVersion` (the client's own version), `outDir` and `builds`. Each build names an `archipelagoVersion` and can override `worldDir`, `dataFolder`, `minimumAp` and `maximumAp`, for a client whose world code differs between Archipelago versions. By default each build's `archipelago.json` carries the world's whole declared range, and the kit refuses a build whose own version is outside its range.

It writes, into `outDir`:

- `<module>-ap<version>.apworld` for each build;
- `<module>.apworld`, a copy of the newest build;
- `<module>.apworld.json`, the index.

It returns `{ index, indexPath, latestPath, files }`.

### The index format

```json
{
  "game": "Relic of the Past",
  "module": "relic_of_the_past",
  "worldVersion": "0.1.0",
  "appVersion": "0.22.0",
  "minimumAp": "0.6.4",
  "maximumAp": "0.6.8",
  "builds": [
    {
      "archipelagoVersion": "0.6.7",
      "file": "relic_of_the_past-ap0.6.7.apworld",
      "sha256": "<64 lowercase hex>",
      "size": 812345,
      "bundle": "relic_of_the_past-ap0.6.7.apworld.sigstore.json"
    }
  ]
}
```

- The top level range is the world's declared range. `maximumAp` is left out when the world has none.
- `builds` is sorted from the oldest Archipelago version to the newest. The last one is the build copied to `<module>.apworld`.
- `file` is a file name, never a path. `bundle` is `<file>.sigstore.json`.
- The kit only names the bundle. The client's CI attests each file (GitHub attestations) and puts each Sigstore bundle beside its file under that name. The kit never signs and never reads a bundle.
- The index keeps its old name, `<module>.apworld.json`, as an alias. The catalog can still read it, and `release-files` (below) builds `archipelia.json` from it. The old shape does not change.

`buildApworldIndex(input)` builds the object from `{ game, module, worldVersion, appVersion, minimumAp, maximumAp?, builds: [{ archipelagoVersion, sha256, size }] }` and checks it: the module is a Python name, versions look like `0.6.8`, no version twice, hashes are 64 lowercase hex characters, sizes are positive, and every build fits the declared range. `serializeApworldIndex` writes it as indented JSON with a trailing newline, `parseApworldIndex` reads and re-checks a file (including the naming rule), `newestBuild` picks the newest build and `apworldNames(module, version)` gives `{ file, bundle, latest, latestBundle, index }`.

## The release manifest and the release files

A release that Archipelia can list carries three standard files next to the apworlds. They have fixed names, so the app finds them without any other lookup.

| File | Holds | Rules |
| --- | --- | --- |
| `archipelia.json` | the release manifest | at most 64 KB, required |
| `archipelia-thumbnail.png` or `archipelia-thumbnail.webp` | the art for the world's card | optional, see below |
| `archipelia-description.md` | the text for the world's details | optional, see below |

### archipelia.json

It is the builds index above under a fixed name, with three keys added: `format`, `direct` and `kit`. `appVersion` becomes optional, because a world without a client of its own has none.

```json
{
  "format": 1,
  "game": "Relic of the Past",
  "module": "relic_of_the_past",
  "worldVersion": "0.1.0",
  "minimumAp": "0.6.4",
  "maximumAp": "0.6.8",
  "direct": true,
  "kit": "0.2.0",
  "appVersion": "0.22.0",
  "builds": [{ "archipelagoVersion": "0.6.7", "file": "relic_of_the_past-ap0.6.7.apworld", "sha256": "<64 lowercase hex>", "size": 812345, "bundle": "relic_of_the_past-ap0.6.7.apworld.sigstore.json" }]
}
```

- `format` is `1`. A reader refuses any other value.
- `direct` says whether the game's own client joins Archipelia lobbies. It is for display. The repository topic is what search uses, and the lobby `hello` is the truth.
- `kit` is the version of this package that wrote the file.
- A world with a single apworld can give `world: { file, sha256, size, bundle? }` in place of `builds`. Give one of the two, never both. `file` is a plain file name ending in `.apworld`, and `bundle` is `<file>.sigstore.json`.
- `maximumAp` and `appVersion` are left out when not given.

The functions are pure and work in a renderer: `buildReleaseManifest(input)` builds and checks the object (the input is the index input plus `direct`, an optional `kit` that defaults to the kit's own version, and `appVersion` optional), `checkReleaseManifest(input)` returns the list of issues without throwing, `serializeReleaseManifest` writes indented JSON with a trailing newline, `parseReleaseManifest(text)` reads and re-checks a file (size cap, `format`, the naming rule), and `indexOfRelease(manifest)` gives the old index shape back when the manifest has `builds` and an `appVersion`. Failures throw a `KitError` of code `invalid-release`.

### The thumbnail

`inspectThumbnail(bytes)` returns `{ header?, issues }`. The image must be:

- a PNG or a WebP, found from its first bytes (a file name or a content type is never trusted);
- square, and at most 1024 by 1024 pixels, read from the header only (no image decoder);
- at most 1 MB (1,048,576 bytes);
- not an animated WebP.

### The description

`checkDescription(bytes)` returns `{ issues, warnings }`. The text must be UTF-8 and at most 64 KB (65,536 bytes). Raw HTML (a tag or a comment, outside code) is a warning, not an error: Archipelia drops it when it shows the text, so use Markdown.

### Writing the files

`writeReleaseFiles({ dir, direct, module?, kit?, thumbnail?, description? })` (Node) reads the index `<module>.apworld.json` that `buildApworldSet` wrote into `dir` (the only `*.apworld.json` there when `module` is left out), then writes `archipelia.json`. When `thumbnail` and `description` are paths, it checks them and copies them to the standard names. The thumbnail name follows the real format (`archipelia-thumbnail.png` or `.webp`), and an older thumbnail of the other format is removed. If any check fails it throws a `KitError` of code `invalid-release-file` listing every problem and writes nothing. It returns `{ manifest, manifestPath, thumbnailPath?, descriptionPath?, warnings }`.

## Command line

`archipelia-kit` is a bin of the package. A client's build script calls it through its package manager, for example `pnpm exec archipelia-kit build-apworld ...`, or runs `node node_modules/@drizztdourden08/archipelia-client-kit/bin/archipelia-kit.mjs`.

| Command | Does |
| --- | --- |
| `build-apworld --world <dir> --out <file> --game <name> --world-version <x.y.z> --minimum-ap <x.y.z> [--maximum-ap <x.y.z>] [--module <name>] [--data <dir>] [--author <name>]... [--exclude <path>]... [--line-endings lf\|keep]` | Builds one apworld and prints `{ file, module, sha256, size }` as one JSON line. |
| `build-set --config <file.json>` | Builds the set and the index. Prints `{ index, latest, files }` as one JSON line. |
| `release-files --dir <release folder> [--module <name>] [--direct] [--thumbnail <image>] [--description <file.md>]` | Writes `archipelia.json` from the index in the folder, and checks and copies the thumbnail and description into it under their standard names. Prints `{ manifest, thumbnail?, description?, warnings }` as one JSON line and each warning on stderr. Exit 1 when a file is refused. |
| `inspect <file.apworld>` | Prints the module, the manifest, the sha256, the size and the entry count. |
| `check-fit <file.apworld> --ap <x.y.z>` | Exit 0 when the world supports that exact version, 1 with the sentence on stderr when it does not. |
| `player-yaml --input <file.json> [--schema <options.json>] [--out <file>] [--allow-unknown] [--allow-roll] [--with-defaults]` | Writes the YAML to stdout or a file. The input is `{ game, slotName, options, description?, preRolled?, preRolledKey? }`. |

The `build-set` config is JSON. Paths are relative to the folder the command runs in:

```json
{
  "game": "Relic of the Past",
  "worldVersion": "0.1.0",
  "appVersion": "0.22.0",
  "minimumAp": "0.6.4",
  "worldDir": "integrations/archipelago/relic_of_the_past",
  "dataFolder": "build/generated",
  "outDir": "release",
  "builds": ["0.6.7", { "archipelagoVersion": "0.6.8" }]
}
```

It also accepts `module`, `maximumAp` and `authors`. Exit codes: 0 done, 1 the work failed or the input is not valid, 2 the command line is wrong. Errors go to stderr, start with `archipelia-kit:` and name the problem.

## Publish your world for Archipelia

Archipelia lists a world from a public GitHub repository that follows this convention. It needs no account and no form.

1. **Add the topic `archipelia-world`** to the repository (About, then the gear icon, then Topics). Also add `archipelia-direct` if the game's own client joins Archipelia lobbies. A topic is lowercase, at most 50 characters, and a repository can have 20.
2. **Attach the files to a stable release** (not a draft, not a pre-release): the apworlds, `archipelia.json` and, if you have them, the thumbnail and the description. The app reads the newest stable release only. The workflow below does all of it.
3. **Keep the repository public and not archived.** Forks are not listed.
4. **Ask for Verified.** A listing in the Archipelia `registry/registry.json` gives the Verified badge. Open a pull request there that adds your game, the client it belongs to and the repository that releases it. Attest your release files as in the workflow below, so Archipelia can check that each download was built by your repository. Without a listing the world still appears, with a note that Archipelia has not reviewed it.

A world needs `archipelia.json` to appear. The thumbnail and the description are optional: without them the app falls back to the repository's social image and its README.

How the app finds you: it searches GitHub for the topic, at most 500 repositories, newest update first, and keeps the list for six hours, so a new world can take that long to show. Each world needs a module name and a game name that no other world uses; when two repositories claim one name, the one with more stars stays and the other is hidden. A person asked to add a world that Archipelia has not reviewed sees your repository and your name first. In the registry pull request, give `repoId` (the number from `gh api repos/<owner>/<repo> --jq .id`) beside `repo`, so a renamed or recreated repository cannot take your place.

### The release workflow

This GitHub Actions workflow builds one apworld per Archipelago version, writes the release files, attests the apworlds and `archipelia.json`, and uploads everything to the release. Put the `build-set` config (see "Command line") in `kit.json` and your art and text where the paths below say. Drop `--direct` if the client does not join lobbies.

```yaml
name: Release
on:
  push:
    tags: ['v*']

permissions:
  contents: write # create the release
  packages: read # install the kit from GitHub Packages
  id-token: write # sign the attestation
  attestations: write # store the attestation

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          registry-url: https://npm.pkg.github.com
          scope: '@drizztdourden08'
      - run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Build the apworlds and the index
        run: npx archipelia-kit build-set --config kit.json

      - name: Write the release files
        run: >
          npx archipelia-kit release-files --dir release --direct
          --thumbnail art/thumbnail.png --description docs/archipelia.md

      - name: Attest the apworlds and archipelia.json
        id: attest
        uses: actions/attest-build-provenance@v2
        with:
          subject-path: |
            release/*.apworld
            release/archipelia.json

      - name: Name the bundles
        env:
          BUNDLE: ${{ steps.attest.outputs.bundle-path }}
        run: |
          for file in release/*.apworld release/archipelia.json; do
            cp "$BUNDLE" "$file.sigstore.json"
          done

      - name: Upload the release assets
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          flag=""
          case "$GITHUB_REF_NAME" in *-*) flag="--prerelease" ;; esac
          gh release create "$GITHUB_REF_NAME" release/* --title "$GITHUB_REF_NAME" --verify-tag $flag
```

How it fits together:

- `build-set` writes `<module>-ap<version>.apworld` for each version, `<module>.apworld` and the old index `<module>.apworld.json`.
- `release-files` adds `archipelia.json` and copies the thumbnail and description to their standard names. It fails the job when the image or the text is refused, so a bad file never reaches a release.
- `actions/attest-build-provenance` signs one attestation that covers every listed file. The step copies its bundle beside each file as `<file>.sigstore.json`, the name the manifest gives. Anyone can check a download with `gh attestation verify <file> --repo <owner>/<repo>`.
- A tag with a hyphen, such as `v1.2.0-beta.1`, is uploaded as a pre-release. Pre-releases are never shown on the card.
- `release/*` uploads the apworlds, the index, `archipelia.json`, the thumbnail, the description and the bundles.

## Errors

Every failure the kit raises is a `KitError`: an `Error` with `name` `KitError`, a `code` and an `issues` list. The codes are `usage`, `invalid-version`, `invalid-manifest`, `invalid-schema`, `invalid-input`, `invalid-package`, `invalid-apworld`, `invalid-index`, `invalid-release`, `invalid-release-file`, `invalid-config` and `unsupported-value`. `isKitError(value)` tells them from other errors.

## Migration note for RotP

The kit replaces three pieces that RotP removed or has not yet moved.

- `renderPlayerYaml` and its YAML emitter under `packages/randomizer/src/archipelago/` become `buildPlayerYaml`. RotP keeps what is its own and passes the result in:
  - Its option snapshot values go in `options`, and `export-options` rows (the `options.json` the exporter writes) go in `schema` through `parseOptionSchema`.
  - `death_link` is just one more option. RotP sets it in `options` before the call.
  - `seed_text` is a text option row, and the app's rolled values go in `preRolled`.
  - A choice valued `random` is now written as its id by the kit, so `concrete-option-values.ts` can be deleted. RotP's `options.json` rows already list `random` among the choices with its id.
  - `progression_balancing` 50 is no longer added by the kit. RotP sets it in `options`, or passes `withDefaults`.
  - `plando_connections` and `start_inventory_from_pool` are no longer dropped by the kit. RotP leaves them out of `options`.
  - The description line is the `description` input.
- The apworld build in `tooling/apworld/` becomes a short script. It runs the TS exporter, then calls `buildApworldSet` (or `archipelia-kit build-set` after writing the exporter's files into a folder and pointing `dataFolder` at it). It no longer needs `jszip`, and the exporter no longer has to write into the package folder.
  - `game` and `worldVersion` come from `AP_GAME` and `AP_WORLD_VERSION`, and `minimumAp` from RotP's own constant.
  - `appVersion` is the app's version.
  - `builds` lists the Archipelago versions RotP supports, one entry each.
  - `version` and `compatibleVersion` stay at the default 7.
- The release job attests every `<module>-ap<version>.apworld` and `<module>.apworld`, and puts the bundles beside them as `<file>.sigstore.json`. It uploads the files, the bundles and `relic_of_the_past.apworld.json` as release assets. The index replaces the older flat manifest `{ game, worldVersion, minimumAp, maximumAp?, sha256, appVersion }`, which is why the catalog and the registry entry need to read the new `builds` list.
- To pick a bundled build for a lobby, RotP reads `lobby.engine.ap` from `lobby.info` and looks for an entry of the index with that `archipelagoVersion`. When none exists, it tells the player the versions in the index. A world can be checked against a version at any time with `checkWorldFit`.
