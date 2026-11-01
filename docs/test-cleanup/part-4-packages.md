## Part 4: engine, trust, design, model, hosts, presets, engine-bundle

Verdicts against the shared test standard. A case is one `it` or `test` call site; an `it.each` counts as one. Nothing was run in this pass (no tests, lint or typecheck); the checker runs them.

| | before | after |
|---|---|---|
| files | 51 | 48 |
| cases | 368 | 344 |
| tagged critical | 0 | 294 |
| tagged standard | 0 | 50 |
| tagged e2e | 0 | 0 |
| untagged | 368 | 0 |

Tags sit on the top-level describe, so every case inside carries exactly one. The KEEP rule is the first word of the describe title.

Notes:

- Standard, not critical: `gg-host` and `remote-host` (S2, fake site and fake SSH with the host's own short poll timers), `verify-world` (K4, but it mints real Sigstore signatures per run, so it is kept off the 1 s budget), `build-engine` (S2, a mocked build that still writes a folder tree per case), the script parity half of `default-spec` (S4).
- Made deterministic (W7): the log case of `gg-host` now awaits the outcome with `vi.waitFor` instead of two 30 ms sleeps; `verify-world` passes its own `now` instead of reading the real clock.
- Removed from inside a kept case: the `CONSOLE_ROW_LIMIT` equals 200 assertion in `console-rows` (W5).
- Unused imports left by the deletions were removed in `build-spec`, `unzip-capped`, `registry-file` and `option-layout`. No helper or fixture lost its last importer, so none was deleted.
- File names are unchanged. `option-layout.keep.test.ts` now holds only the choice case; its width cases were W3.

| file | verdict | rule | cases before | cases after |
|---|---|---|---|---|
| engine/build/build-spec.keep.test.ts | trim | K4, W4 | 9 | 7 |
| engine/engine-defaults.keep.test.ts | delete | W5 | 3 | 0 |
| engine/install/install-engine.keep.test.ts | keep | K1, K3 | 12 | 12 |
| engine/install/remove-engine.keep.test.ts | trim | K4, W4 | 5 | 4 |
| engine/install/run-smoke.keep.test.ts | keep | K1 | 6 | 6 |
| engine/packages/install-packages.keep.test.ts | keep | K4, K1 | 11 | 11 |
| engine/packages/parse-requirements.keep.test.ts | keep | K4, K1 | 8 | 8 |
| engine/stages.keep.test.ts | keep | K1 | 2 | 2 |
| engine/state/engine-adoption.built.keep.test.ts | keep | K3 | 3 | 3 |
| engine/state/engine-adoption.keep.test.ts | keep | K3 | 4 | 4 |
| engine/state/engine-runtime.keep.test.ts | keep | K3, K1 | 13 | 13 |
| engine/state/engine-state.keep.test.ts | keep | K3 | 9 | 9 |
| engine/versions/python-range.keep.test.ts | trim | K1, W4 | 21 | 20 |
| engine/versions/requirement-rules.keep.test.ts | trim | K1, W5, W8 | 14 | 10 |
| engine/versions/version-feed.keep.test.ts | keep | K1 | 19 | 19 |
| engine/versions/version-tag.keep.test.ts | keep | K1 | 10 | 10 |
| engine/wheel/wheel-install.keep.test.ts | keep | K4 | 6 | 6 |
| engine/wheel/wheel-tags.keep.test.ts | keep | K1 | 9 | 9 |
| trust/load-registry.keep.test.ts | keep | K1 | 9 | 9 |
| trust/load-trusted-root.keep.test.ts | keep | K4 | 6 | 6 |
| trust/parse-registry.keep.test.ts | keep | K4 | 8 | 8 |
| trust/read-world-game.keep.test.ts | keep | K5 | 3 | 3 |
| trust/registry-blocked.keep.test.ts | keep | K4 | 5 | 5 |
| trust/registry-file.keep.test.ts | trim | K2, W5 | 8 | 4 |
| trust/verify-real-bundle.keep.test.ts | delete | W8 | 1 | 0 |
| trust/verify-world.keep.test.ts | trim | K4, W4 | 19 | 18 |
| design/console-rows.keep.test.ts | keep | K1 | 3 | 3 |
| design/control-values.keep.test.ts | keep | K1 | 10 | 10 |
| design/game-card-actions.keep.test.ts | trim | K1, W5 | 3 | 2 |
| design/game-card-status.keep.test.ts | delete | W5 | 1 | 0 |
| design/option-coercion.keep.test.ts | keep | K1 | 4 | 4 |
| design/option-layout.keep.test.ts | trim | K1, W3 | 5 | 2 |
| design/option-mapping.keep.test.ts | keep | K1 | 10 | 10 |
| model/install-failure.keep.test.ts | keep | K2 | 4 | 4 |
| model/run-migration.keep.test.ts | keep | K3 | 7 | 7 |
| model/run-overrides.keep.test.ts | keep | K1 | 10 | 10 |
| model/template-migration.keep.test.ts | keep | K3 | 4 | 4 |
| model/unzip-capped.keep.test.ts | trim | K5, W5 | 6 | 5 |
| model/zip-limits.keep.test.ts | keep | K4 | 5 | 5 |
| hosts/gg-host.keep.test.ts | keep | S2 | 6 | 6 |
| hosts/host-binding.keep.test.ts | keep | K4 | 3 | 3 |
| hosts/remote-host.keep.test.ts | keep | S2 | 12 | 12 |
| hosts/remote-parts.keep.test.ts | keep | K4, K1 | 9 | 9 |
| presets/random-choice.keep.test.ts | keep | K1 | 2 | 2 |
| presets/values.keep.test.ts | keep | K1 | 5 | 5 |
| engine-bundle/apignore.keep.test.mjs | keep | K1 | 4 | 4 |
| engine-bundle/build-engine.keep.test.mjs | keep | S2 | 12 | 12 |
| engine-bundle/default-spec.keep.test.mjs | trim | K1, S4, W5 | 5 | 4 |
| engine-bundle/game-name.keep.test.mjs | keep | K1 | 7 | 7 |
| engine-bundle/global-ignore.keep.test.mjs | keep | K3 | 3 | 3 |
| engine-bundle/world-imports.keep.test.mjs | keep | K1 | 5 | 5 |

## Deleted critical tests

- engine/engine-defaults: the default Archipelago is a stable version above the floor. W5, a constant of the defaults file.
- engine/engine-defaults: each default Python names its own file and checksum. W5, a constant; the pinned files are used by the real build.
- engine/engine-defaults: the default engine of each target has a safe folder name. W5, and the id rule is covered by `default-spec` parity.
- engine/build-spec: pip wheel gets only options it has. W4, the same command is already pinned by the two spec cases.
- engine/build-spec: the build env holds only the allowed names. W4, the keep and drop cases already cover the allowlist.
- engine/remove-engine: refuses an engine a running session uses. W4, the same refusal as the active engine case.
- engine/python-range: macOS reads the same branch as Windows. W4, one more permutation of the Windows case.
- engine/requirement-rules: the applied rules are returned (length 2). W5, counts a constant list.
- engine/requirement-rules: every rule of the app defaults parses. W8, no assertion.
- engine/requirement-rules: the pinned Python files name version and release. W5, duplicate of engine-defaults.
- engine/requirement-rules: the default Archipelago is a commit above the floor. W5, duplicate of engine-defaults.
- trust/registry-file: lists Relic of the Past as the first client. W5, asserts data, not a rule.
- trust/registry-file: says Relic of the Past is a builds index. W5, asserts data.
- trust/registry-file: is the floor the app ships. W5, asserts data.
- trust/registry-file: lists the repo id of the Relic release. W5, asserts a constant.
- trust/verify-real-bundle: PLACEHOLDER real bundle. W8, a skipped test with no fixture.
- trust/verify-world: another workflow in the registry entry. W4, same code path as the repo and issuer mismatch cases.
- design/game-card-actions: a loading or disabled action stays so. W5, a passthrough of two props.
- design/game-card-status: needs-package reads as a warning. W5, asserts a constant.
- design/option-layout: toggle, number and slider sizes. W3, widths.
- design/option-layout: a select takes the width of its longest label. W3, widths.
- design/option-layout: lists and tables take the row. W3, widths.
- model/unzip-capped: an apworld is capped tighter than a generator archive. W5, compares two constants.
- engine-bundle/default-spec: the default spec is the engine of the app defaults. W5, a constant; the parity case below it covers the logic.
