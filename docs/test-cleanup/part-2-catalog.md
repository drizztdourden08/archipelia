## Part 2: packages/catalog

Rules: K1 to K5 map to the critical tag, S2 and S3 to the standard tag. No case needed the e2e tag. Every kept case carries its rule at the start of its title and exactly one vitest tag in its options argument.

| | before | after |
|---|---|---|
| files | 57 | 57 |
| cases | 473 | 464 |
| tagged critical | 0 | 306 |
| tagged standard | 0 | 158 |
| tagged e2e | 0 | 0 |
| untagged | 473 | 0 |

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
| prerelease-only.keep.test.ts | keep | S2, S3 | 10 | 10 |
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
