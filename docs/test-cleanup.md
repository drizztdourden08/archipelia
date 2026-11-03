<!-- @layer docs @kind doc -->
# Test clean-up

Verdicts against the shared test standard (test-standard.md in the config repo). A case is one `it` or `test` call site; an `it.each` counts as one. The coders ran nothing in this pass. The checker runs the changed files afterwards.
Branch: standards/phase.

## Counts for the whole repo

| | before | after |
|---|---|---|
| files | 232 | 228 |
| cases | 1669 | 1562 |
| tagged critical | 0 | 1183 |
| tagged standard | 0 | 352 |
| tagged e2e | 0 | 27 |
| untagged | 1669 | 0 |

The counts add up the four parts below. The 3 cases defined in the desktop e2e rig helper are tagged e2e and are not counted. A raw scan of the final tree finds 228 files.

Nine files came from main after the branch was cut (direct-worlds, lobby-view, member-options, server-draft, lobby-seats, sessions-editor, template-validation, prerelease-only, member-yaml) and got the same treatment in a later pass. They add 15 cases (member-options 5, sessions-editor 4, member-yaml 2, prerelease-only 4 new) to both columns; lobby-view lost 2 cases to W3 and W10 as before.

## How tags were chosen

- critical: K1 to K5 with no process, network, real build or real clock.
- standard: S1 to S4, plus K cases that run a real loopback listener, a temp folder tree or mocked Sigstore signing, the same as Brock's choice for its http server tests.
- e2e: the desktop app journeys, real sandbox and real server specs.
- Rule D-89, one tag rule for the repo: a test that runs an in-process loopback server (the lobby rig `startLobbyRig`, a websocket or http listener on 127.0.0.1 inside the test process, a fake site) is `standard`; `e2e` is only for a test that spawns a child process, runs a real sandbox (bwrap), a real external tool or Python, a real Archipelago server process, or the real app.
- Per-test timeouts were removed. The preset sets the limit per tag.

## Part 1: apps/desktop

Scope: every test file under `apps/desktop/tests` (unit tests and e2e specs). A case is one `it` or `test` call site; `it.each` counts as one. The three cases that `e2e/support/multiworld-rig.ts` defines for both multiworld specs are kept as they were and are counted in neither column.

| | before | after |
|---|---|---|
| test files | 66 | 65 |
| cases | 427 | 391 |
| tagged `critical` | 0 | 302 |
| tagged `standard` | 0 | 75 |
| tagged `e2e` | 0 | 14 (plus the 3 rig cases) |

Every kept case carries exactly one tag, set on its describe or on the test, and a KEEP rule in its title. Tag choices: pure functions, fakes and temp-folder files are `critical`; anything that opens a real loopback listener (`startLobbyRig`, `startFixture`, `runStarted`), a real websocket, or the `status` and `token` CLI commands is `standard`; the built app, the built server process and the real engine are `e2e`. Per-test timeouts were removed. The silent-server timeout case and the retry-timer case were W7 and are deleted. `keep-runs-loaded` now settles with microtask flushes instead of `setTimeout`. The dock geometry check (W3) was removed from the live room e2e step and `e2e/app/support/dock-geometry.ts` was deleted with it.

| file | verdict | rule | cases before | cases after |
|---|---|---|---|---|
| builds/build-processes.keep.test.ts | trim | K1 K4 S3 | 4 | 3 |
| builds/tool-processes.keep.test.ts | trim | K1 K4 | 7 | 5 |
| data/failures.keep.test.ts | keep | K1 | 3 | 3 |
| data/old-runs.keep.test.ts | keep | K1 | 1 | 1 |
| e2e/app/archipelia-app.e2e.ts | keep | E1 | 10 | 10 |
| e2e/multiworld.e2e.ts | keep | E2 | 0 | 0 |
| e2e/passwords.e2e.ts | keep | E2 | 2 | 2 |
| e2e/server-process.e2e.ts | keep | E2 | 2 | 2 |
| engine/choice-plan.keep.test.ts | trim | K1 | 9 | 8 |
| engine/engine-startup-dialogs.keep.test.ts | trim | K1 | 13 | 11 |
| engine/engine-startup.keep.test.ts | keep | S2 | 12 | 12 |
| engine/installed-list.keep.test.ts | trim | K1 | 8 | 7 |
| engine/setup-progress.keep.test.ts | trim | K1 | 4 | 3 |
| engine/version-options.keep.test.ts | trim | K1 | 14 | 12 |
| engine/version-tag.keep.test.ts | trim | K1 | 10 | 8 |
| games/direct-worlds.keep.test.ts | keep | K1 | 6 | 6 |
| games/first-party-card.keep.test.ts | trim | K1 | 9 | 7 |
| games/game-card-busy.keep.test.ts | trim | K1 | 6 | 4 |
| games/game-card-package.keep.test.ts | keep | K2 | 7 | 7 |
| games/game-consent.keep.test.ts | keep | K1 K4 | 6 | 6 |
| games/game-rows.keep.test.ts | keep | K1 | 4 | 4 |
| games/game-store-view.keep.test.ts | trim | K1 | 4 | 3 |
| games/game-totals.keep.test.ts | trim | K1 | 6 | 5 |
| games/prerelease-only.keep.test.ts | keep | K1 | 3 | 3 |
| games/ready-worlds.keep.test.ts | trim | K1 K4 | 13 | 12 |
| games/tool-ended.keep.test.ts | keep | K1 | 5 | 5 |
| games/version-picker.keep.test.ts | trim | K1 | 11 | 10 |
| live/run-live.keep.test.ts | keep | K4 S2 S3 | 18 | 18 |
| live/settle-live-tabs.keep.test.ts | keep | K3 | 6 | 6 |
| live/start-live.keep.test.ts | keep | K3 K4 S3 | 7 | 7 |
| lobbies/host-choice.keep.test.ts | keep | K1 | 12 | 12 |
| lobbies/join-client.keep.test.ts | keep | S2 | 5 | 5 |
| lobbies/join-files.keep.test.ts | keep | K1 K4 | 3 | 3 |
| lobbies/lobby-security.keep.test.ts | trim | K1 K4 | 11 | 8 |
| lobbies/lobby-server.keep.test.ts | keep | S2 S3 | 5 | 5 |
| lobbies/lobby-view.keep.test.ts | trim | K1 K4 | 11 | 8 |
| lobbies/member-options.keep.test.ts | keep | K1 | 5 | 5 |
| lobbies/probe-lobby.keep.test.ts | keep | S2 | 3 | 3 |
| lobbies/remote-admin.keep.test.ts | keep | S2 | 6 | 6 |
| lobbies/server-view.keep.test.ts | trim | K1 | 12 | 11 |
| presets/option-problems.keep.test.ts | keep | K1 | 6 | 6 |
| presets/preset-import.keep.test.ts | trim | K1 K3 | 9 | 7 |
| presets/preset-list.keep.test.ts | trim | K1 | 11 | 10 |
| presets/preset-more-actions.keep.test.ts | trim | S1 | 2 | 1 |
| runs/keep-runs-loaded.keep.test.ts | keep | K3 | 3 | 3 |
| server/cli.keep.test.ts | keep | K1 K2 | 6 | 6 |
| server/config.keep.test.ts | keep | K2 | 6 | 6 |
| server/open-join.keep.test.ts | keep | S2 | 1 | 1 |
| server/tls.keep.test.ts | keep | K4 S2 | 7 | 7 |
| servers/server-draft.keep.test.ts | keep | K1 | 9 | 9 |
| sessions/builder-failure.keep.test.ts | delete | W5 W10 | 2 | 0 |
| sessions/console-replies.keep.test.ts | keep | K1 | 5 | 5 |
| sessions/direct-session.keep.test.ts | keep | K1 K4 S2 S3 | 10 | 10 |
| sessions/history-summary.keep.test.ts | trim | K1 | 6 | 5 |
| sessions/home-summary.keep.test.ts | keep | K1 | 4 | 4 |
| sessions/hosting-defaults.keep.test.ts | keep | K1 | 2 | 2 |
| sessions/lobby-closer.keep.test.ts | trim | K3 | 4 | 3 |
| sessions/lobby-seats.keep.test.ts | keep | K1 | 8 | 8 |
| sessions/player-command-groups.keep.test.ts | keep | K1 | 2 | 2 |
| sessions/player-edits.keep.test.ts | keep | K1 | 6 | 6 |
| sessions/problem-focus.keep.test.ts | keep | K1 | 3 | 3 |
| sessions/run-stages.keep.test.ts | keep | K1 | 1 | 1 |
| sessions/session-view.keep.test.ts | trim | K1 | 7 | 6 |
| sessions/sessions-editor.keep.test.ts | keep | K1 | 4 | 4 |
| sessions/template-defaults.keep.test.ts | keep | K1 | 7 | 7 |
| sessions/template-validation.keep.test.ts | keep | K1 K3 | 12 | 12 |

### Deleted critical tests

Cases that would have been critical (pure logic, no I/O) and were deleted.

- build-processes: declares the venv, tools, crates and wheel steps with a label and a time limit. W5, a constant table.
- tool-processes: declares one elevated job and one not. W5, a constant table.
- tool-processes: can be cancelled even when the installer raises its own rights. W5, asserts a declaration flag.
- choice-plan: older versions install like newer ones. W4, same behavior as the other install cases.
- engine-startup-dialogs: names the new version and says what happens. W10, prose wording.
- engine-startup-dialogs: neutral Release notes button keeps the dialog open. W3, markup behavior of a button.
- installed-list: a failed install with no named check still reads Failed. W4, same state mapping as its sibling cases.
- setup-progress: a failed engine reads Setup failed. W10, a label.
- version-options: older releases stay pickable. W4, covered by the installed-release case.
- version-options: a release added to the feed later is a valid pick. W4, same rule as the case above it.
- version-tag: reads Up to date when the list is fresh. W4, the kept cached case covers the branch.
- version-tag: reads Not checked when GitHub was never reached. W10, a label.
- first-party-card: with and without an appVersion (2 cases). W4, one behavior in two states.
- game-card-busy: the card being installed reads Adding. W3, button markup.
- game-card-busy: the busy sentence names the game. W10, prose wording.
- game-store-view: the card opens its details and carries no hover hint. W3, markup.
- game-totals: an installed index world is under Installed on All. W4, same count rule as the neighbours.
- ready-worlds: a listed world is Verified and has no review note. W4, the reviewed-world case keeps the boundary.
- version-picker: with an appVersion each row keeps its world version. W4, same rows in a second state.
- lobby-security: says why a plain address is refused. W10, prose wording.
- lobby-security: gives up on a server that accepts the connection and never answers. W7, needs a real timeout.
- lobby-security: start private, only this computer reaches the server until the first lobby opens it. W4, the network options case covers it.
- lobby-view: holds only configuration. W3, DOM shape of the section.
- lobby-view: tags a verified client as registered and an unlisted one as unlisted. W10, label wording.
- lobby-view: lists the room and its files once the lobby has started. W3, DOM shape.
- server-view: shows the pin and the answer of the server. W3, markup.
- preset-import: the summary names what was skipped. W10, prose wording.
- preset-import: offers the game defaults and every built-in preset. W4, the built-in preset case covers it.
- preset-list: problems read as sentences with option names. W10, prose wording.
- preset-more-actions: the menu holds the rare actions in order. W3, menu order.
- builder-failure: each action has its own sentence, and an unknown key gets a general one (file deleted, 2 cases). W5 and W10, a constants table and prose.
- history-summary: status tones follow the run state. W5, a label and tone constant.
- session-view: labels and status tones. W5, a constant table.
- lobby-closer: retries a pending close on its own timer until the server answers. W7, needs a real timer; the manual `retryAll` case keeps the retry logic.

## Part 2: packages/catalog

Rules: K1 to K5 map to the critical tag, S2 and S3 to the standard tag. No case needed the e2e tag. Every kept case carries its rule at the start of its title and exactly one vitest tag in its options argument.

| | before | after |
|---|---|---|
| files | 57 | 57 |
| cases | 477 | 468 |
| tagged critical | 0 | 306 |
| tagged standard | 0 | 162 |
| tagged e2e | 0 | 0 |
| untagged | 477 | 0 |

A case is one test, it or each call site. No file was deleted whole, no helper or fixture became orphaned, and no per-test timeout or testTimeout option existed.

| file | verdict | rule | cases before | cases after |
|---|---|---|---|---|
| build-accepted-archive.keep.test.ts | keep | K4 | 2 | 2 |
| build-archive.keep.test.ts | keep | K4 | 9 | 9 |
| build-binding.keep.test.ts | keep | K4 | 5 | 5 |
| build-consent.keep.test.ts | keep | K3, K4, S2 | 6 | 6 |
| build-failure.keep.test.ts | keep | S3 | 5 | 5 |
| build-missing.keep.test.ts | keep | K1 | 5 | 5 |
| build-prepare.keep.test.ts | keep | K4, S2, S3 | 6 | 6 |
| build-requires.keep.test.ts | keep | K1 | 6 | 6 |
| build-run.keep.test.ts | keep | K2, K4, S3 | 6 | 6 |
| build-rust.keep.test.ts | keep | K1, K4, S2, S3 | 10 | 10 |
| build-sandbox.keep.test.ts | keep | K2, K4, S3 | 6 | 6 |
| build-tools.keep.test.ts | keep | K4, S2, S3 | 6 | 6 |
| carry-worlds.keep.test.ts | keep | K3 | 3 | 3 |
| catalog-large.keep.test.ts | trim | S3 | 3 | 2 |
| catalog-limit.keep.test.ts | keep (W7 fixed) | K1, K2, S2, S3 | 6 | 6 |
| catalog-read-once.keep.test.ts | keep | S3 | 1 | 1 |
| enrich-docs.keep.test.ts | keep | K1, S2, S3 | 5 | 5 |
| enrich-github.keep.test.ts | keep | K1, K4, S2, S3 | 10 | 10 |
| enrich-limit.keep.test.ts | keep (W7 fixed) | K1, K4, S2, S3 | 4 | 4 |
| enrich-markdown.keep.test.ts | keep | K1 | 11 | 11 |
| enrich-release.keep.test.ts | keep | K1, K4, S2, S3 | 10 | 10 |
| first-party-fit.keep.test.ts | trim | K1 | 13 | 12 |
| first-party-install.keep.test.ts | keep | K2, K3, K4, S3 | 18 | 18 |
| first-party-merge.keep.test.ts | keep | K1 | 4 | 4 |
| first-party-read.keep.test.ts | keep | K2, S3 | 7 | 7 |
| first-party-service.keep.test.ts | trim | K4, S2 | 6 | 3 |
| first-party-standard.keep.test.ts | keep | K1, K2, K4, S3 | 11 | 11 |
| first-party-switch.keep.test.ts | trim | K3, S3 | 8 | 7 |
| guard-records.keep.test.ts | keep | K3 | 3 | 3 |
| hash-decision.keep.test.ts | keep | K1 | 4 | 4 |
| package-unavailable.keep.test.ts | keep | K1, K2, S3 | 8 | 8 |
| parse-entry.keep.test.ts | keep | K1 | 9 | 9 |
| prerelease-enrich.keep.test.ts | keep | S2 | 1 | 1 |
| prerelease-only.keep.test.ts | keep | S2, S3 | 14 | 14 |
| read-apworld.keep.test.ts | keep | K1, K5 | 5 | 5 |
| ready-names.keep.test.ts | keep | K4 | 2 | 2 |
| ready-search.keep.test.ts | keep | K1, K3, K4, S2, S3 | 8 | 8 |
| ready-service.keep.test.ts | keep (W7 fixed) | K4, S2, S3 | 16 | 16 |
| requires-graph.keep.test.ts | keep | K1 | 5 | 5 |
| source-network.keep.test.ts | keep | K1, S2, S3 | 12 | 12 |
| source-plan.keep.test.ts | keep | K4, S2 | 5 | 5 |
| source-ranking.keep.test.ts | keep | K1 | 15 | 15 |
| tool-detect.keep.test.ts | keep | K1, K4 | 11 | 11 |
| tool-install.keep.test.ts | keep | K4, S2, S3 | 19 | 19 |
| tool-sources.keep.test.ts | keep | K1, K4, S2 | 16 | 16 |
| tool-table.keep.test.ts | keep | K1 | 19 | 19 |
| tool-trust.keep.test.ts | keep | K1, K2, K4 | 14 | 14 |
| versions-picker.keep.test.ts | trim (W7 fixed) | K4, S2, S3 | 15 | 14 |
| wheel-consent.keep.test.ts | trim | K4, S2, S3 | 16 | 15 |
| wheel-metadata.keep.test.ts | keep | K1 | 3 | 3 |
| wheel-pick.keep.test.ts | keep | K1 | 10 | 10 |
| wheel-plan.keep.test.ts | keep | S2, S3 | 7 | 7 |
| wheel-prepare.keep.test.ts | trim | K4, S2, S3 | 14 | 13 |
| wheel-reinstall.keep.test.ts | keep | K3, K4, S2, S3 | 10 | 10 |
| wheel-session.keep.test.ts | keep (W7 fixed) | K4, S2 | 5 | 5 |
| world-packages-consent.keep.test.ts | keep | K4, S2, S3 | 11 | 11 |
| world-packages.keep.test.ts | keep | K1, K3, S2, S3 | 8 | 8 |

### W7 fixes

- enrich-limit: the two setTimeout delays were replaced by a microtask tick, so the concurrency peaks no longer depend on a timer.
- catalog-limit, ready-service, versions-picker: the rate limit reset header was built from Date.now(); it is now a fixed far-future constant. The catalog-limit check of the listed time now asserts a positive number instead of comparing with the real clock.
- wheel-session: the part file prune now passes a fixed now and fixed file times instead of Date.now().

### Deleted critical tests

- catalog-large, "the first-party merge keeps all of them and adds its own": W4, the same merge rule is tested in first-party-merge.
- first-party-fit, "assertReleaseFits throws the reason when the engine does not fit": W9, a helper the install "version fit" test in first-party-install already reaches.
- first-party-service, "shows No release yet when the release has no manifest": W4, the same state is tested through first-party-read and first-party-install.
- first-party-service, "marks the entry not available for an engine outside its declared versions": W4, the fit rule is tested in first-party-fit.
- first-party-service, "says No release yet when asked to install a game with no release": W4, first-party-install tests the same refusal.
- first-party-switch, "picks the other build for the other engine": W4, the test that reinstalls the build for the new engine covers it.
- versions-picker, "a stable release is recorded as not a pre-release": W4, the install without a tag already asserts the stable release record.
- wheel-consent, "sends the dependencies of the wheel with the requirements of the world through the same resolve": W6, it only asserted a mock call, and the next case plus the preview and install case cover the resolve input.
- wheel-prepare, "never takes an address from the release": W8, it asserted that an address absent from every fixture never appeared, so it could not fail.

## Part 3: server, lobby-protocol, client-kit, sessions

Verdicts against `docs/test-standard.md`. A case is one `it` or `test` call site; a `test.each` counts as one. Nothing was run in this pass (no tests, lint or typecheck); the checker runs them. Counts come from a scan of the tree at HEAD (before) and of the edited files (after).

| | before | after |
|---|---|---|
| files | 58 | 58 |
| cases | 397 | 359 |
| tagged critical | 0 | 281 |
| tagged standard | 0 | 65 |
| tagged e2e | 0 | 13 |
| untagged | 397 | 0 |

By package (cases before, after): server 147 to 140, lobby-protocol 106 to 85, client-kit 81 to 74, sessions 63 to 61.

Tag rule used (D-89): an in-process loopback server, socket or listener is standard; a spawned process, a real sandbox, a real engine or Python is e2e; a read of a committed fixture file outside a temp folder is standard (S2/S3/S4 or the KEEP rule of the case); fake timers, in-memory fakes and temp-folder files are critical. The KEEP rule is named in the title of the tagged describe or test.

No helper was deleted: every file under `tests/` that is not a test is still imported by a kept test. The `tick` export of `packages/server/tests/lobby/security-kit.ts` was removed because nothing uses it any more (W7).

W7 changes (sleeps and real clocks):

- `consent-gate` N3: the sleep and the 1 s race are gone; the test waits for the registry call to be reached, then settles the lobby.
- `security-review` F1 and `security` F1: `tick()` replaced by a promise that resolves when the gated trust check is reached. `security` F1 now awaits the refusal itself before it releases the check.
- `security` F2: waits for the 101 response instead of 100 ms. `security` F3: waits for the first reply instead of 30 ms.
- `security-review` N1 and `security` F5 (standard): the `Date.now()` upper bound is gone; the awaited socket close is the outcome.
- `confined-output` (e2e): the `Date.now()` bound on the disk cap test is gone.
- Per-test timeouts removed in conformance, run-record, overlay-engine, bwrap-sandbox, lan-loopback, bin and confined-output.

| file | verdict | rule | cases before | cases after |
|---|---|---|---|---|
| server/tests/core/room-binding.keep.test.ts | keep | K1 critical | 3 | 3 |
| server/tests/create-core.keep.test.ts | trim | S2 standard | 8 | 5 |
| server/tests/listener/admin-hardening.keep.test.ts | trim | K4 standard | 4 | 3 |
| server/tests/lobby/apworld-caps.keep.test.ts | keep | K4 critical | 4 | 4 |
| server/tests/lobby/conformance.keep.test.ts | keep | K2 standard | 1 | 1 |
| server/tests/lobby/consent-gate.keep.test.ts | keep | K4 critical | 9 | 9 |
| server/tests/lobby/local-address.keep.test.ts | keep | K1 critical | 2 | 2 |
| server/tests/lobby/member-yaml.keep.test.ts | keep | K2 K4 standard | 2 | 2 |
| server/tests/lobby/overlay-engine.keep.test.ts | keep | E2 e2e (real engine, Python) | 1 | 1 |
| server/tests/lobby/room-secrets.keep.test.ts | keep | K4 critical | 5 | 5 |
| server/tests/lobby/run-record.keep.test.ts | keep | K2 standard | 4 | 4 |
| server/tests/lobby/security-review.keep.test.ts | keep | K4 critical, N1 standard | 6 | 6 |
| server/tests/lobby/security.keep.test.ts | keep | K4 critical, F2 and F5 standard | 9 | 9 |
| server/tests/network/advertise.keep.test.ts | keep | K2 critical | 8 | 8 |
| server/tests/network/browse.keep.test.ts | keep | K1 critical | 14 | 14 |
| server/tests/network/codec.keep.test.ts | keep | K1 critical | 7 | 7 |
| server/tests/network/map-port.keep.test.ts | keep | K1 critical | 12 | 12 |
| server/tests/network/mode.keep.test.ts | keep | K1 critical | 2 | 2 |
| server/tests/network/public-lookup.keep.test.ts | keep | K1 critical | 3 | 3 |
| server/tests/node-core.keep.test.ts | trim | K3 and K4 critical, S2 and K2 standard | 8 | 7 |
| server/tests/run-jobs.keep.test.ts | keep | K1 critical | 4 | 4 |
| server/tests/sandbox/bwrap-sandbox.keep.test.ts | keep | K4 e2e (real bwrap) | 1 | 1 |
| server/tests/sandbox/sandbox-path.keep.test.ts | keep | K4 critical | 4 | 4 |
| server/tests/sandbox/sandbox-runner.keep.test.ts | trim | K4 critical | 18 | 17 |
| server/tests/sandbox/server-info.keep.test.ts | trim | K2 standard | 2 | 1 |
| server/tests/start/lan-loopback.keep.test.ts | keep | K2 standard | 2 | 2 |
| server/tests/start/listen-again.keep.test.ts | keep | K1 standard | 2 | 2 |
| server/tests/start/reach-cgnat.keep.test.ts | keep | K1 critical | 2 | 2 |
| lobby-protocol/tests/client-frames.keep.test.ts | keep | K2 critical | 2 | 2 |
| lobby-protocol/tests/codec.keep.test.ts | trim | K1 and K2, 3 standard (fixtures), rest critical | 17 | 15 |
| lobby-protocol/tests/discovery.keep.test.ts | trim | K1 critical | 13 | 12 |
| lobby-protocol/tests/harness.keep.test.ts | keep | K1 critical, fake-failure cases standard | 16 | 16 |
| lobby-protocol/tests/kit-and-schemas.keep.test.ts | trim | K1 and K2, 4 standard (fixtures), rest critical | 11 | 9 |
| lobby-protocol/tests/lobby-info.keep.test.ts | trim | K4 standard, K1 critical | 9 | 3 |
| lobby-protocol/tests/resume.keep.test.ts | trim | K1 and K3, 5 standard (fixtures), rest critical | 15 | 12 |
| lobby-protocol/tests/scenarios.keep.test.ts | trim | K2 standard | 5 | 2 |
| lobby-protocol/tests/version.keep.test.ts | trim | K1 critical | 12 | 8 |
| lobby-protocol/tests/wire.keep.test.ts | keep | K2 standard (real sockets), K1 and K2 critical (frames, memory) | 6 | 6 |
| client-kit/tests/apworld.keep.test.ts | trim | K1, K2 and K3 critical | 14 | 12 |
| client-kit/tests/bin.keep.test.ts | trim | E2 e2e (spawns node) | 4 | 3 |
| client-kit/tests/cli.keep.test.ts | keep | K2 critical, player-yaml standard | 7 | 7 |
| client-kit/tests/index-manifest.keep.test.ts | trim | K2 critical | 8 | 7 |
| client-kit/tests/release-files.keep.test.ts | trim | K1 and K3 critical | 14 | 12 |
| client-kit/tests/release-manifest.keep.test.ts | trim | K2 critical | 10 | 9 |
| client-kit/tests/version.keep.test.ts | keep | K1 critical | 5 | 5 |
| client-kit/tests/yaml.keep.test.ts | keep | K1 and K2, 5 standard (read the rotp fixtures), rest critical | 19 | 19 |
| sessions/tests/confined-output.keep.test.ts | trim | K4 e2e (spawns the generator) | 9 | 8 |
| sessions/tests/failure-of.keep.test.ts | keep | K1 critical | 2 | 2 |
| sessions/tests/hints-from-log.keep.test.ts | keep | K1 critical | 1 | 1 |
| sessions/tests/live-room.keep.test.ts | keep | K1 and K2 critical | 12 | 12 |
| sessions/tests/online-from-log.keep.test.ts | keep | K1 critical | 3 | 3 |
| sessions/tests/player-yaml.keep.test.ts | keep | K2 critical | 4 | 4 |
| sessions/tests/reconnect-backoff.keep.test.ts | keep | K1 critical | 4 | 4 |
| sessions/tests/room-password-need.keep.test.ts | keep | K1 critical | 6 | 6 |
| sessions/tests/run-store.keep.test.ts | trim | K3 critical | 3 | 2 |
| sessions/tests/session-engine.keep.test.ts | keep | K1 critical | 10 | 10 |
| sessions/tests/session-service-engine.keep.test.ts | keep | S2 standard | 6 | 6 |
| sessions/tests/started-run.keep.test.ts | keep | K1 critical | 3 | 3 |

Assertions removed inside kept cases (no case lost): the `IN_MEMORY_NOTICE` wording in room-secrets (W5), the mode constants in `network/mode` (W5), the `stop()` resolves-undefined check in node-core (W8), the `TOKEN_LENGTH` constant in resume (W5), the fixture sentence in lobby-protocol `version` (W10), the fixture read in the lobby-info locked case (W1), the `RECONNECT_DELAYS_MS` and `LEGACY_ENGINE.ap` constants in sessions (W5).

### Deleted critical tests

Every deleted case that would have run as critical or standard (the e2e case is listed last).

- server create-core "wires every service": a list of the keys of the core object, W2/W5 (the type and the other cases cover it).
- server create-core "the network port decides the binding": asserts a mock was called, W6.
- server create-core "dispose stops the local servers and does not throw": only "does not throw", W8.
- server node-core "picks an address for the lobby": a regex on a getter, W5/W8.
- server sandbox-runner "never passes the host environment": the exact env is already asserted by the basic arguments case, W4.
- lobby-protocol codec "the standard texts in the fixtures match the helpers": prose wording of fixtures, W10.
- lobby-protocol codec "every message type has a schema in its direction": repeats the type and the schema table, W5.
- lobby-protocol discovery "the service name and the beacon port are fixed": constants, W5.
- lobby-protocol kit-and-schemas "the RotP sizes of the spec example are kept": constants, W5.
- lobby-protocol kit-and-schemas "every schema is a draft 2020-12 document": a test of the library and the schema files, W5.
- lobby-protocol lobby-info "the reply names the lobby version...", "an unknown code gets lobby-not-found...", "a closed lobby and an unsupported protocol...", "the request is rate limited...", "the request has a size limit...": fixture content and the same behavior in states already played by the scenario runs, W1/W4/W10.
- lobby-protocol lobby-info "the full RotP exchange starts with lobby.info": reads the fixture text, W1.
- lobby-protocol resume "a pending member that resumes gets its pending state back": a second state of the outcomes case, W4.
- lobby-protocol resume "the fixtures use the texts the outcome builds": prose wording of fixtures, W10.
- lobby-protocol resume "a resumed welcome keeps the token and marks resumed": fixture content, played by the scenario runs, W1.
- lobby-protocol scenarios "the catalog and the fixture files name the same scenarios": reads the fixture folder, W1.
- lobby-protocol scenarios "every welcome and lobby.info.reply carries the protocol constant": a constant in fixtures, W5.
- lobby-protocol scenarios "the RotP example exchange covers ...": reads fixture structure, W1.
- lobby-protocol version "the version-mismatch fixture carries the same sentence", "the world-range-mismatch fixture ...", "the world-version-conflict fixture ...": prose wording of fixtures, W10.
- lobby-protocol version "a range is not accepted": the same refusal as the mismatch cases in another state, W4.
- client-kit apworld "returns the sha256 and size of the bytes": getter shape, covered by the reproducible cases, W5.
- client-kit apworld "the same input twice gives the same sha256": the reproducible case covers it, W4.
- client-kit bin "names the GitHub Packages scope and registry, and is not private": reads package.json, W1.
- client-kit index-manifest "a second run gives the same index and the same files": same behavior as the first run case, W4.
- client-kit release-files "accepts a square image up to 1024 by 1024": a state of the size rules, the boundary cases remain, W4.
- client-kit release-files "returns the HTML warning and still writes the description": the HTML warning case covers it, W4.
- client-kit release-manifest "the kit version in the manifest is the version of this package": reads package.json, W1.
- sessions confined-output "a message names the cap in gibibytes": prose wording, W10.
- sessions run-store "looks the saved sessions up only for the runs that need it": counts lookups of a callback, W6.
- server admin-hardening "the network mode off" (standard): the same host assertions are made by lan-loopback, W4.
- server server-info "reports no sandbox when none was found" (standard): another state of one behavior, W4.

### Left as is, unsure

- `lobby/conformance.keep.test.ts` still uses a 150 ms drain sleep in its test transport (`DRAIN_MS`); it needs a real socket to flush (standard, an in-process loopback). A deterministic close would need a change in the protocol testing kit.
- `security` F3 now waits for the first reply, then asserts no second one; a late second reply could land after the check.
- `network/map-port` and `start/reach-cgnat` run code under test with 2 ms internal retry delays (tagged critical); a retry-delay option on the code would make them timer free.
- `yaml.keep.test.ts` reads two fixtures at import, so every case in the file loads them; only the cases that use them are tagged standard.

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
