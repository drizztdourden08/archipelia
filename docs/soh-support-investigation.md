<!-- @layer docs @kind doc -->
# Supporting Ship of Harkinian (SoH) in Archipelia: investigation

Date: 2026-11-03 (second revision, after owner feedback). Research only, no code written, nothing built or run. Sources: this repository and the public GitHub repositories named below, read through the GitHub API (HarbourMasters/Shipwright `develop`, read 2026-11-03).

> Superseded in direction (2026-11-03): the owner wants the integration inside a maintained SoH fork, with an Archipelia tab in the game. The plan is the published page `.claude/plans/soh-archipelia-in-game.html`. Sections 1 and 2 below stay valid as research; sections 4 and 5 (the stock-SoH adapter) are background only.

## 1. Direct answers

**Does SoH have a plugin system?** No. There is no runtime code plugin, no scripting language, no `dlopen` of mods (the only `dlopen` is for the eSpeak speech library). `docs/MODDING.md` defines a "code mod" as: fork the repository, branch from `develop`, edit the C++, rebuild. The `mods` folder only loads **asset** archives (`.otr` / `.o2r`: textures, models, audio), managed by `mod_menu.cpp`.

**Is there something plugin-like?** Yes, an out-of-process remote-control layer that is built into the official builds (the release workflow passes `-DBUILD_REMOTE_CONTROL=1` for Windows, Linux and macOS). It is what Crowd Control and Anchor use, and our integration can use the same door:

| Surface | What it gives | Where |
| --- | --- | --- |
| **Sail** | JSON over TCP, null-terminated packets. SoH dials **out** to `127.0.0.1:43384` (host and port are CVars, enabled from the Network menu). SoH pushes hook events; the remote sends effects and console commands. | `soh/soh/Network/Sail/Sail.cpp` |
| **Hook table (`GameInteractor`)** | 85 in-game hooks (`OnItemReceive`, `OnFlagSet`, `OnSceneFlagSet`, `OnLoadGame`, `OnTransitionEnd`, `OnGenerationCompletion`, file-select hooks, ...). Sail forwards 10 of them to the remote: `OnTransitionEnd`, `OnLoadGame`, `OnExitGame`, `OnItemReceive`, `OnEnemyDefeat`, `OnActorInit`, `OnFlagSet`/`Unset`, `OnSceneFlagSet`/`Unset`. Any in-process C++ can register for all 85. | `GameInteractor_HookTable.h`, `Sail.cpp` |
| **Console commands** (a Sail `command` packet runs any of them) | `give_item randomizer <RandomizerGet id>` (grants any randomizer item through the normal get-item path), `give_item vanilla <id>`, `item`, `rupee`, `addammo`, `gen_rando [seed]`, `file_select`, `reset`, `entrance`, `kill`, `heal`, ~50 more. | `soh/soh/Enhancements/debugconsole.cpp` |
| **Spoiler file load** | The randomizer reads a JSON spoiler file (drop handler accepts any JSON with `version` and `finalSeed`). It holds `file_hash`, settings, `locations` (check name to item, with optional `model`, `price`, `trickName` for traps) and hints. The Plandomizer writes and reads the same shape. | `randomizer.cpp`, `SeedContext.cpp`, `Plandomizer.cpp` |
| **Anchor / CrowdControl** | Same pattern, other protocols. Anchor syncs items and flags between players. | `soh/soh/Network/` |

Limits of the remote door, from the code: Sail's `OnItemReceive` packet carries only `tableId` and `getItemId`, **not which location** the item came from; there is no Sail effect that gives a randomizer item (only the console command does); and Sail's `command` path does not check that a save is loaded (only `effect` packets do), so the remote must gate on `OnLoadGame` itself.

## 2. What already exists for Archipelago (corrected)

My first draft called this "HarbourMasters ships it". That was too strong. What I can verify:

- The apworld `oot_soh` (game name `Ship of Harkinian`, world 1.4.2, min Archipelago 0.6.7) lives in `HarbourMasters/Archipelago-SoH`, branch `oot-soh`, a fork of ArchipelagoMW/Archipelago. Releases `Soh_1.0.0` (2025-11-02) to `Soh_1.4.2` (2026-07-03), each with the apworld, a YAML template and **separate SoH builds** (Windows, Linux, Mac).
- The in-game client is in `jeromkiller/Shipwright_archipellago`, a personal fork of Shipwright, branch `Harkipellago`, about 340 commits ahead of and 555 behind upstream. A native `apclientpp` client under `soh/soh/Network/Archipelago`.
- The repository is inside the HarbourMasters GitHub organisation, and its leads (aMannus, Jerm) are Shipwright contributors; jeromkiller is a public organisation member. But **none of it is in official SoH releases**: no Shipwright release note (9.3.1 and earlier) mentions Archipelago, the Shipwright README does not, and the client has never been merged upstream. The repository README itself says it is a separate build "for now". Whether the SoH team endorses it I cannot tell from public data; the owner may know better.
- A third-party Android build (`Odrannnn/Shipwright-Archipelago-Android`) is a downstream of that fork.

So treat it as a community integration, valuable as a reference (it solved the location table, hints, DeathLink) but not as something Archipelia can assume will ship with SoH.

## 3. Archipelia side, in short

(Full contract: `packages/lobby-protocol/README.md`.) "Direct connection" lets a game's own client join an Archipelia lobby over a WebSocket protocol (`hello`, upload apworld and YAML, `ready`, then `lobby.started` returns the room address and password), after which the client talks to the Archipelago server normally. A client that proves its apworld with a GitHub attestation can be listed in `registry/registry.json`; others join as "unlisted" only if the host allows. The desktop app is itself a lobby client and host, runs Archipelago **0.6.7**, and builds player YAMLs from a world's options. It has no code today to launch or configure an external game process.

## 4. How we make our own integration

There are three real routes. Which one depends on whether we accept shipping our own SoH build.

### Route 1: adapter on stock SoH through Sail (no fork, works on official releases)

Archipelia (main process) runs two things: a TCP server on 43384 that SoH's Sail dials into, and an Archipelago client in Node. The loop:

1. **Seed.** From the slot data and the apworld's placement, write an SoH spoiler JSON: items for our own world as themselves, items for other players as a placeholder (a junk item or a custom model). The player loads it in SoH (file drop or the `RandomizerDroppedFile` CVar) and starts a randomizer save.
2. **Check out.** Turn Sail `OnSceneFlagSet` / `OnFlagSet` packets into `RandomizerCheck` ids, the way SoH's own check tracker does (`randomizer_check_tracker.cpp` registers on the same three hooks), then send `LocationChecks`. This needs a table, generated from SoH source per SoH version, from flags to checks (`RCToRandInf.cpp` is part of it).
3. **Item in.** On `ReceivedItems`, send Sail `command` `give_item randomizer <id>`, queued until a save is loaded and Link can take items. The received index is kept in Archipelago data storage, not in the save file.
4. **Housekeeping.** Goal (`GAME` status) on the credits/Ganon flag, DeathLink through a `kill` command, address changes handled by Archipelia since it owns the connection.

Unknowns to prove in a spike, not guesses: whether a hand-written spoiler with placeholders loads cleanly and what `settings` it needs to match the apworld; whether every check type (cows, scrubs, shops, freestanding items, rupee-checks) raises a distinguishable flag; whether `give_item` is safe during cutscenes and shops; stability of the `RandomizerGet` numbering between SoH versions (pin per version). Size, rough: 4 to 8 weeks for one developer to reach a reliable playthrough; the check table and version pinning are the long tail.

**Cleanest upgrade to Route 1:** an upstream Shipwright PR of a few dozen lines in `Sail.cpp`: forward a "check collected" hook that carries the `RandomizerCheck`, and add a "give randomizer item" effect with a location-aware ack. It removes the flag-to-check table and the item-id fragility. Upstream accepted all of Sail, so it is plausible, but we cannot depend on its timing.

### Route 2: our own patched SoH build (in-process, speaks the lobby protocol)

Fork Shipwright (which is also how SoH defines a code mod), add an Archipelia lobby client plus the Archipelago client, ship it with a GitHub-attested release workflow, and register it as a listed `archipelia-direct` client, exactly like Relic of the Past. Best end-user experience and the only route with full control of UI (item models, "sent to X" messages). Cost: we maintain a fork against fast-moving `develop` (six releases between March and October 2026), 8 to 16 weeks to first release, ongoing rebase work. Re-using the code of the existing community AP client would shorten the client half a lot.

### Route 3: host and launch the existing community build

Archipelia installs `oot_soh.apworld`, hosts the session, then starts the community SoH build pre-filled with address, slot and password (needs a small connect hook in that build, like the Android intent it already has). Fast (days to a couple of weeks) and uses a proven client, but it depends on a fork we do not control.

## 5. Suggested plan

1. **Spike (1 week, Route 1 feasibility):** a throwaway Node script that runs the Sail server, loads a hand-written spoiler, logs flag packets for a few check types, and calls `give_item`. This turns the unknowns above into facts. It is the one thing that decides between Route 1 and Route 2.
2. **First milestone:** one SoH slot in a local Archipelia session: place items from a generated multiworld, get one check out and one item in, on a stock SoH release. Route 3 can run in parallel as the quick demo path.
3. **Then** choose between finishing Route 1 (with the upstream PR as the stabiliser) and Route 2 (lobby-protocol client, listed in the registry).

## 6. Risks

- Remote door gaps listed in section 1 (no location in `OnItemReceive`, no give-item effect, commands not save-gated). Route 1 is only as sturdy as the flag-to-check table.
- Location and option parity with the apworld: Archipelago decides placement, SoH only knows its own `RandomizerCheck` list. The community apworld's `Locations.py` is the reference for the mapping.
- Version drift: SoH releases often; ids and flags move. Pin and test against one SoH version at a time.
- Network menu / Sail must be enabled by the player (a menu toggle or `soh.json`); Archipelia can write the config but I did not verify that SoH rereads it at launch.
- The player's own OoT ROM is required; Archipelia cannot ship or fetch it.

## 7. Open questions for the owner

1. Is shipping and maintaining our own SoH build (Route 2) acceptable, or must it work on official SoH releases (Route 1)?
2. Do you have a contact on the SoH team? An upstream PR for the two Sail additions changes Route 1 from fragile to solid.
3. Should the Archipelia lead's board get items for the spike and for "launch an external game client" (new app capability, not SoH-specific)?
