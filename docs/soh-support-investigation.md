<!-- @layer docs @kind doc -->
# Supporting Ship of Harkinian (SoH) in Archipelia: investigation

Date: 2026-11-03. Research only, no code written. Sources: this repository, and the public GitHub repositories named below, read through the GitHub API. SoH was not built or run, and no game was started.

## Short answer

Do not build a bridge from SoH's built-in randomizer. **HarbourMasters already ships a full Archipelago integration for SoH**: an apworld (`oot_soh`, game name `Ship of Harkinian`) and a native Archipelago client inside a separate SoH build. It plays through a normal Archipelago room, so the host side of Archipelia can run it with little or no new code. What is missing is the *join* experience (launching SoH already connected) and, optionally, a SoH client that speaks the Archipelia lobby protocol. Recommended path: prove the host side by hand, then add a launch/pre-fill step, then talk to HarbourMasters about the lobby protocol. Details below.

## 1. How Archipelia's direct connection works

"Direct connection" is a per-session switch (`DirectConnection` in `packages/model/src/session.type.ts`: `admission` open or host-approval, `allowUnlisted`, `allowedGames`). A session with it on opens an Archipelia **lobby**, and a game's own client joins that lobby by itself, instead of the host collecting YAML files by hand. A seat for such a client is a `DirectPlayer` slot. The contract is the **lobby protocol v1** (`packages/lobby-protocol/README.md`, the text meant for third-party client authors):

- WebSocket (`ws`/`wss`, one port, default 38290, path `/archipelia/lobby`), one JSON object per text frame.
- Flow: `lobby.info` (optional, learn the Archipelago version and allowed games) then `hello`, then `welcome`, then uploads, then `ready`, then (host starts) `lobby.progress`, then `lobby.started`.
- `hello` carries: client id/name/version/platform, the **exact** Archipelago version the client runs (no ranges; the lobby's engine version must equal it), the apworld of each game (module, world version, sha256, size, optional Sigstore proof), and the slots (name, game, YAML sha256). Capabilities: `slots.yaml` required, `worlds.upload` optional.
- The client uploads the apworld (max 64 MiB) and the YAML (max 256 KiB) in base64 chunks, content-addressed by sha256, then sends `ready`. Reconnects use a member token (`resume`).
- `lobby.started` hands back the room address, password, an optional loopback `localAddress`, and per-slot output files. From there the client connects to the Archipelago server with the ordinary Archipelago client protocol. Later `room.status` events can move the address (room restarts on another port).
- Trust: a client with a registry id must prove its apworld with a GitHub artifact attestation (Sigstore, SLSA provenance v1), verified against `registry/registry.json`. Without proof it is "unlisted" and only joins lobbies with `allowUnlisted`, and the host must consent to running its Python.
- Tooling for clients: `packages/client-kit` (player YAML writer, apworld builder, `archipelia.json` release manifest, GitHub topics `archipelia-world` / `archipelia-direct`). RotP is the only registered client today.

Two more facts matter here:

- The Archipelia desktop app is itself a lobby client (`apps/desktop/electron/joins`: hello, upload, ready, results), and it runs a bundled Archipelago engine, currently **0.6.7** (`packages/engine/engine-defaults.json`). So the app can already host a session and join one for any installed apworld game, with the player YAML built from the world's options. The game client is then started by the player.
- Nothing in the app launches or configures an external game client today (the only spawned processes are the engine and SSH hosts). This is the real gap for any game integration.

## 2. How SoH works

**Built-in randomizer** (HarbourMasters/Shipwright, branch `develop`, active as of 2026-11-01). Code in `soh/soh/Enhancements/randomizer`: item locations (`RandomizerCheck`), items (`RandomizerGet`), item overrides, logic derived from the 3D randomizer, hints, entrance data, a Plandomizer. It generates its own seed/spoiler file in-game. I did not study that file format, because the Archipelago integration below makes it unnecessary.

**Upstream network hooks** (`soh/soh/Network`): `Anchor` (multiplayer sync), `CrowdControl`, and `Sail`, a JSON-over-TCP remote. SoH connects *out* to `127.0.0.1:43384`, packets are null-terminated JSON. Sail sends hooks (`OnItemReceive`, `OnFlagSet`, `OnSceneFlagSet`, `OnLoadGame`, `OnTransitionEnd`, ...) and accepts effects (set/unset flags, health, rupees, ammo, teleport, console commands). I saw no "give this randomizer item" effect, so Sail alone is too thin for a multiworld without extra SoH changes. It sits on `GameInteractor`, a hook table, which is what the Archipelago client uses too.

**Archipelago integration, already built by HarbourMasters:**

| Piece | Where | State |
| --- | --- | --- |
| apworld `oot_soh`, game `Ship of Harkinian`, world 1.4.2, min Archipelago 0.6.7 | [HarbourMasters/Archipelago-SoH](https://github.com/HarbourMasters/Archipelago-SoH), branch `oot-soh` (fork of ArchipelagoMW/Archipelago) | 9 releases, `Soh_1.0.0` (2025-11-02) to `Soh_1.4.2` (2026-07-03); leads aMannus and Jerm |
| Native client in the game (`soh/soh/Network/Archipelago`, uses `apclientpp`) | fork [jeromkiller/Shipwright_archipellago](https://github.com/jeromkiller/Shipwright_archipellago) (branch `Harkipellago`); shipped as separate Windows/Linux/Mac SoH zips in the apworld releases | diverged from upstream Shipwright (337 ahead, 555 behind at the time); "eventually" to be merged upstream; I found no merged or open upstream PR for it |
| Player YAML | template shipped with each release; options page not on archipelago.gg yet | ~370 to ~1600 checks depending on options |

How the client behaves: server address, slot and password are entered in the ESC menu (Network > Archipelago), or come from the save file. A new Archipelago save is made from the file-select screen after connecting (it scouts all locations first), and the save stores the address, slot and password, then auto-connects when loaded. Same-slot co-op works (items sync through the server). It supports DeathLink, DamageLink and TrapLink, hints through data storage, and works next to Anchor. It needs the player's own OoT ROM (no Master Quest yet; no entrance shuffle or gossip hints yet). Client and apworld must match on major and minor version.

A third-party Android port ([Odrannnn/Shipwright-Archipelago-Android](https://github.com/Odrannnn/Shipwright-Archipelago-Android)) adds a connect request (`QueueConnectionRequest`) fed by an Android intent or a `soh://archipelago/connect?address=...&slot=...` link. That is the exact hook a desktop launcher wants, so the idea is proven, but I found no desktop equivalent (no command line option or URI scheme) in the source I read.

Not to confuse with: the original ArchipelagoMW `Ocarina of Time` world (emulator based, not compatible with SoH; the SoH docs say the two are separate), and `ComboShip` (an OOTMM experience, not Archipelago).

## 3. Options

| Option | What it is | For | Against | Rough size |
| --- | --- | --- | --- | --- |
| **A. Host only** | Install `oot_soh.apworld`, Archipelia builds YAMLs from its options, generates with its engine (0.6.7 meets the world's minimum), hosts the room. Players paste address/slot/password into SoH. | No SoH change at all; probably already works | Manual join; the address in a save goes stale if a local room restarts on another port | 0 to 1 day to verify, maybe a catalog entry |
| **B. Archipelia as lobby client plus launcher** | The desktop app joins a lobby for the player (it already can), gets the room from `lobby.started`, then starts SoH with the connection prefilled | Works with unmodified lobby protocol and the real SoH client; small SoH patch | New capability: configure the SoH path, spawn a process; needs a connect hook in the desktop SoH build (CLI or `soh://`, port of the Android one) or a pre-filled config (untested, hacky) | A few days in Archipelia plus a small PR to the SoH client fork |
| **C. SoH client speaks the lobby protocol** | The game joins the lobby itself, like RotP: `hello`, upload apworld and YAML, `ready`, connect | Best end state; SoH shows as a listed `archipelia-direct` client | Needs HarbourMasters to adopt it: C++ WebSocket/JSON/sha256/base64 work, an in-game YAML editor or reuse of the template, CI attestation of the apworld, a registry PR, and a matching Archipelago version policy | Weeks, across two repositories we do not own |
| **D. Own bridge on Sail** | Archipelia-side Archipelago client that drives SoH through Sail | None we need | Duplicates the official client; Sail has no item-give effect | Large; not recommended |
| **E. Reuse the original OoT world** | The ArchipelagoMW OoT world | Already upstream | Not SoH (needs an emulator) | Out of scope |

## 4. Recommendation

1. **Milestone 1 (first, cheap): prove Option A.** Install `oot_soh.apworld` 1.4.2 into the app (as a manual or community world), make a one-slot session with `Ship of Harkinian`, generate with engine 0.6.7, host it, connect the HarbourMasters SoH build by hand, and send one check. This answers whether the option schema is read from the world correctly (the YAML template is 55 KB), whether the room survives a restart, and what a stale save address looks like. No game window is needed on our side beyond the owner's own test.
2. **Milestone 2: Option B**, the launch/pre-fill step, after asking HarbourMasters whether a command line option or `soh://` link for desktop is acceptable (the Android code is the model). Without it, fall back to documenting the manual paste.
3. **Milestone 3 (optional, needs their agreement): Option C.** Open a conversation with Jerm and aMannus; if yes, the work on our side is mostly docs and the registry entry, and on theirs the lobby client plus attesting the apworld (their release workflow attests the Archipelago launcher builds; I saw no attestation of `oot_soh.apworld`).

## 5. Main risks

- **Fork lag and ownership.** The client lives in a fork that is hundreds of commits behind upstream Shipwright. If it stalls, SoH players are stuck on an old build. Pin and test against `Soh_1.4.2`.
- **Version coupling.** Client and apworld must match; Archipelia pins one engine version per lobby (0.6.7 vs a world minimum of 0.6.7 is fine, but no headroom if a later world needs more).
- **Trust path.** Unattested apworld means "unlisted" in lobbies, with host consent. Fine for option A (the host chooses the apworld), a blocker for a listed client in C.
- **Stale address in saves.** Each save keeps its own address; a local room that comes back on another port breaks auto-connect until the player edits it.
- **Player's own ROM**, platform limits (the SoH AP zips exist for Windows, Linux and Mac), and unfinished features (Master Quest, entrance shuffle, gossip hints).
- **Unverified here:** that Archipelia's engine loads the apworld and exposes all its options; that a desktop connect hook is absent in current builds (I read source, not the release zips).

## 6. Open questions for the owner

1. Is "host a SoH game" enough for now (Milestone 1), or is a one-click join with the game launched a requirement (Milestone 2)?
2. May we contact the HarbourMasters maintainers about a desktop connect option and, later, the lobby protocol?
3. Should the Archipelia lead's board get an item for "launch an external game client" (a new capability, not specific to SoH)?
