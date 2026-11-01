## Part 1: apps/desktop

Scope: every test file under `apps/desktop/tests` (unit tests and e2e specs). A case is one `it` or `test` call site; `it.each` counts as one. The three cases that `e2e/support/multiworld-rig.ts` defines for both multiworld specs are kept as they were and are counted in neither column.

| | before | after |
|---|---|---|
| test files | 64 | 63 |
| cases | 418 | 382 |
| tagged `critical` | 0 | 293 |
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
