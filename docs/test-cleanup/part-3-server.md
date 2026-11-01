## Part 3: server, lobby-protocol, client-kit, sessions

Verdicts against `docs/test-standard.md`. A case is one `it` or `test` call site; a `test.each` counts as one. Nothing was run in this pass (no tests, lint or typecheck); the checker runs them. Counts come from a scan of the tree at HEAD (before) and of the edited files (after).

| | before | after |
|---|---|---|
| files | 57 | 57 |
| cases | 395 | 358 |
| tagged critical | 0 | 282 |
| tagged standard | 0 | 43 |
| tagged e2e | 0 | 33 |
| untagged | 395 | 0 |

By package (cases before, after): server 145 to 138, lobby-protocol 106 to 85, client-kit 81 to 74, sessions 63 to 61.

Tag rule used: a real socket, listener or spawned process is e2e; a read of a committed fixture file outside a temp folder is standard (S2/S3/S4 or the KEEP rule of the case); fake timers, in-memory fakes and temp-folder files are critical. The KEEP rule is named in the title of the tagged describe or test.

No helper was deleted: every file under `tests/` that is not a test is still imported by a kept test. The `tick` export of `packages/server/tests/lobby/security-kit.ts` was removed because nothing uses it any more (W7).

W7 changes (sleeps and real clocks):

- `consent-gate` N3: the sleep and the 1 s race are gone; the test waits for the registry call to be reached, then settles the lobby.
- `security-review` F1 and `security` F1: `tick()` replaced by a promise that resolves when the gated trust check is reached. `security` F1 now awaits the refusal itself before it releases the check.
- `security` F2: waits for the 101 response instead of 100 ms. `security` F3: waits for the first reply instead of 30 ms.
- `security-review` N1 and `security` F5 (e2e): the `Date.now()` upper bound is gone; the awaited socket close is the outcome.
- `confined-output` (e2e): the `Date.now()` bound on the disk cap test is gone.
- Per-test timeouts removed in conformance, run-record, overlay-engine, bwrap-sandbox, lan-loopback, bin and confined-output.

| file | verdict | rule | cases before | cases after |
|---|---|---|---|---|
| server/tests/core/room-binding.keep.test.ts | keep | K1 critical | 3 | 3 |
| server/tests/create-core.keep.test.ts | trim | S2 standard | 8 | 5 |
| server/tests/listener/admin-hardening.keep.test.ts | trim | K4 e2e | 4 | 3 |
| server/tests/lobby/apworld-caps.keep.test.ts | keep | K4 critical | 4 | 4 |
| server/tests/lobby/conformance.keep.test.ts | keep | K2 e2e | 1 | 1 |
| server/tests/lobby/consent-gate.keep.test.ts | keep | K4 critical | 9 | 9 |
| server/tests/lobby/local-address.keep.test.ts | keep | K1 critical | 2 | 2 |
| server/tests/lobby/overlay-engine.keep.test.ts | keep | E2 e2e | 1 | 1 |
| server/tests/lobby/room-secrets.keep.test.ts | keep | K4 critical | 5 | 5 |
| server/tests/lobby/run-record.keep.test.ts | keep | K2 e2e | 4 | 4 |
| server/tests/lobby/security-review.keep.test.ts | keep | K4 critical, N1 e2e | 6 | 6 |
| server/tests/lobby/security.keep.test.ts | keep | K4 critical, F2 and F5 e2e | 9 | 9 |
| server/tests/network/advertise.keep.test.ts | keep | K2 critical | 8 | 8 |
| server/tests/network/browse.keep.test.ts | keep | K1 critical | 14 | 14 |
| server/tests/network/codec.keep.test.ts | keep | K1 critical | 7 | 7 |
| server/tests/network/map-port.keep.test.ts | keep | K1 critical | 12 | 12 |
| server/tests/network/mode.keep.test.ts | keep | K1 critical | 2 | 2 |
| server/tests/network/public-lookup.keep.test.ts | keep | K1 critical | 3 | 3 |
| server/tests/node-core.keep.test.ts | trim | K3 and K4 critical, S2 standard, K2 e2e | 8 | 7 |
| server/tests/run-jobs.keep.test.ts | keep | K1 critical | 4 | 4 |
| server/tests/sandbox/bwrap-sandbox.keep.test.ts | keep | K4 e2e | 1 | 1 |
| server/tests/sandbox/sandbox-path.keep.test.ts | keep | K4 critical | 4 | 4 |
| server/tests/sandbox/sandbox-runner.keep.test.ts | trim | K4 critical | 18 | 17 |
| server/tests/sandbox/server-info.keep.test.ts | trim | K2 e2e | 2 | 1 |
| server/tests/start/lan-loopback.keep.test.ts | keep | K2 e2e | 2 | 2 |
| server/tests/start/listen-again.keep.test.ts | keep | K1 e2e | 2 | 2 |
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
| lobby-protocol/tests/wire.keep.test.ts | keep | K2 e2e (real sockets), K1 and K2 critical (frames, memory) | 6 | 6 |
| client-kit/tests/apworld.keep.test.ts | trim | K1, K2 and K3 critical | 14 | 12 |
| client-kit/tests/bin.keep.test.ts | trim | E2 e2e | 4 | 3 |
| client-kit/tests/cli.keep.test.ts | keep | K2 critical, player-yaml standard | 7 | 7 |
| client-kit/tests/index-manifest.keep.test.ts | trim | K2 critical | 8 | 7 |
| client-kit/tests/release-files.keep.test.ts | trim | K1 and K3 critical | 14 | 12 |
| client-kit/tests/release-manifest.keep.test.ts | trim | K2 critical | 10 | 9 |
| client-kit/tests/version.keep.test.ts | keep | K1 critical | 5 | 5 |
| client-kit/tests/yaml.keep.test.ts | keep | K1 and K2, 5 standard (read the rotp fixtures), rest critical | 19 | 19 |
| sessions/tests/confined-output.keep.test.ts | trim | K4 e2e | 9 | 8 |
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
- server admin-hardening "the network mode off" (e2e): the same host assertions are made by lan-loopback, W4.
- server server-info "reports no sandbox when none was found" (e2e): another state of one behavior, W4.

### Left as is, unsure

- `lobby/conformance.keep.test.ts` still uses a 150 ms drain sleep in its test transport (`DRAIN_MS`); it needs a real socket to flush, so it stays e2e. A deterministic close would need a change in the protocol testing kit.
- `security` F3 now waits for the first reply, then asserts no second one; a late second reply could land after the check.
- `network/map-port` and `start/reach-cgnat` run code under test with 2 ms internal retry delays (tagged critical); a retry-delay option on the code would make them timer free.
- `yaml.keep.test.ts` reads two fixtures at import, so every case in the file loads them; only the cases that use them are tagged standard.
