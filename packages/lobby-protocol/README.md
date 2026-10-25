<!-- @layer docs @kind doc -->
# Archipelia lobby protocol, version 1

This package is the contract between an Archipelia server and any program that joins its lobbies. It holds the wire types, the JSON Schemas, the codec, the version rules, the fixtures, a fake client and a fake server. Relic of the Past (RotP) is the first client and builds its side against the fake server in this package.

The text below is meant to be enough for a third party to write a client. The words MUST, MUST NOT, SHOULD and MAY are used as in RFC 2119. Every byte count is in bytes. Every hash is SHA-256, written as 64 lowercase hex characters.

## Roles and words

- Server: an Archipelia server, standalone or embedded in the Archipelia desktop app.
- Host: the person who runs the server and owns the lobby. The host acts through the admin API, never through this protocol.
- Client: a program that joins a lobby for a player. RotP is the first one.
- Lobby: a short-lived room on the server that gathers players before one Archipelago game.
- Member: one client identity inside a lobby. A member can carry several slots.
- Slot: one Archipelago player. It has a slot name, a game and a player YAML.
- World: an apworld file (a zip of a Python package) that teaches Archipelago a game.
- Registry: the list of accepted clients that Archipelia publishes.

## Using the package

The package name is `@drizztdourden08/archipelia-lobby-protocol`. It has no runtime dependency and imports nothing from Electron or from the Archipelia app. It needs Node 24 or newer for the parts that touch the network or the file system.

The package is published to GitHub Packages, like the Brock and Tessera packages, by the release workflow of the Archipelia repository. The scope must match the GitHub owner.

1. In the client's `.npmrc`, map the scope to the registry and give it a token:

   ```ini
   @drizztdourden08:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

2. Set `NODE_AUTH_TOKEN` to a GitHub personal access token (classic) with the `read:packages` scope. In a GitHub Actions job, use the job's `GITHUB_TOKEN` and grant the job `packages: read`. Never commit the token.
3. Install it:

   ```sh
   pnpm add @drizztdourden08/archipelia-lobby-protocol
   ```

The published package ships built JavaScript (ES modules) with `.d.ts` files in `dist`, and the fixtures in `fixtures`. A consumer runs it with plain Node and needs no transpile step. The declarations use relative imports without extensions, so a TypeScript consumer should use `moduleResolution: "bundler"` (or `skipLibCheck`). The `/testing` entry compiles with the DOM lib on. In the Archipelia repository the package points at its TypeScript source, and `node scripts/build.mjs` makes `dist`.

A client never has to build a message with a helper. Messages are plain objects. The package exports a type for each one (`Hello`, `UploadBegin`, `Ready` and the rest) and `validateMessage` and `encodeMessage` check and write them. It builds only the things that need a rule: `createError` (an `error` message), `buildDiscoveryTxt` and `buildBeacon` (the discovery record), `formatLobbyCode` and the version sentences (`checkClientVersion`, `checkWorldRange`, `checkWorldVersion`).

The package has three entry points.

| Import | Holds | Needs Node |
| --- | --- | --- |
| `@drizztdourden08/archipelia-lobby-protocol` | constants, message types, schemas, the validator, the codec, error rules, version rules, lobby code helpers, the resume outcome, the discovery record and beacon | no |
| `@drizztdourden08/archipelia-lobby-protocol/node` | `newToken`, `hashToken`, `sha256Hex`, and the WebSocket transport over a socket (`createSocketTransport`, `upgradeResponse`) that servers and the fake server share | yes (`node:crypto`, `node:stream`) |
| `@drizztdourden08/archipelia-lobby-protocol/testing` | the fixtures loader, the scenario kit, `createFakeServer`, `createFakeClient`, `runScenario`, the WebSocket transport and an in-memory transport | yes |

The fixtures are plain files under `fixtures/`, also reachable as `@drizztdourden08/archipelia-lobby-protocol/fixtures/<scenario>.jsonl`.

The pure entry point is safe for a renderer. The other two use `node:` modules and belong to a main process, a server or a test.

## Transport and framing

- The transport is WebSocket (RFC 6455). The URL path is `/archipelia/lobby`.
- One port carries both `ws://` and `wss://`. The server reads the first byte of each TCP connection and routes a TLS handshake to TLS. A client SHOULD try `wss://` first and fall back to `ws://` only when the TLS handshake fails, never after a certificate error on a host that offered TLS with a valid certificate before.
- The default port is `38290`. A server address is `host[:port]`. A client MUST accept a bare host and use the default port.
- Every message is one WebSocket text frame holding one JSON object, UTF-8, no BOM. Binary frames are not used. A server that receives one answers `bad-message` and closes with code `4400`.
- A message MUST be at most `limits.maxMessageBytes` (1 048 576 unless the server says otherwise). Before `welcome`, the limit is 65 536. A `lobby.info` request has its own limit of 1 024 bytes.
- Every message has a `type` string. A request from the client MAY carry `seq`, a positive integer unique per connection. A server reply to it carries `re` with the same number. Server events carry no `re`.
- Unknown fields MUST be ignored by both sides. An unknown `type` from the client gets an `error` with code `bad-message`, not fatal once the member is welcomed. An unknown `type` from the server MUST be ignored by the client.
- The server sends a WebSocket ping every 30 s. A connection silent for 90 s is closed. A member survives a closed connection for the life of the lobby and comes back with the token it was given (see the section on the member token).

## Versioning of the protocol

- The protocol name is `archipelia-lobby`. This document is major version `1`, exported as `PROTOCOL_VERSION`.
- The client lists the majors it speaks in `protocol.versions`, in `lobby.info` and in `hello`. The server picks the highest common one and states it in `protocol.version` of its reply. With none in common it sends `error` `protocol-unsupported` with `supported: [..]` and closes with `4401`. `negotiateProtocol` does this.
- Inside a major, changes are additive only: new optional fields, new message types, new error codes. Anything else is a new major. A server keeps the previous major for at least one year after a new one ships.
- Optional features are named in `capabilities`. Version 1 defines:
  - `slots.yaml`: the client sends player YAML files. Required in version 1.
  - `worlds.upload`: the client can upload the apworlds of its slots.
  - `seed.upload`: reserved for a later client that sends a finished seed. A version 1 server ignores it. Its messages are not defined here.

## Asking about a lobby before joining

A client that ships no Archipelago files can ask what a lobby needs before it uploads anything and before the host sees it. The exchange is unauthenticated and reveals no member and no private state. It is the first message of a connection, and it can be followed by `hello` on the same connection.

```json
{
  "type": "lobby.info", "seq": 1,
  "protocol": { "name": "archipelia-lobby", "versions": [1] },
  "lobby": { "code": "K7QM-4XT2" }
}
```

The server answers with `lobby.info.reply`:

```json
{
  "type": "lobby.info.reply", "re": 1,
  "protocol": { "name": "archipelia-lobby", "version": 1 },
  "server": { "name": "Archipelia", "version": "0.9.0" },
  "lobby": {
    "name": "Friday seed",
    "engine": { "ap": "0.6.8" },
    "phase": "open",
    "joinable": true,
    "admission": "host-approval",
    "allowUnlisted": false,
    "worlds": [ { "game": "Relic of the Past", "worldVersion": "0.1.0" } ],
    "requires": { "capabilities": ["slots.yaml"] }
  },
  "limits": { "maxMessageBytes": 1048576, "chunkBytes": 262144, "maxWorldBytes": 67108864, "maxYamlBytes": 262144, "maxMemberBytes": 134217728 }
}
```

- `lobby.engine.ap` is the exact Archipelago version the lobby runs. A client that runs another version tells the player to install this one before it joins. This is what the version rule of the handshake enforces.
- `lobby.worlds` lists the games the lobby already fixed and the world version of each. A client that carries another version of the same game learns it here and not from a refusal.
- `lobby.joinable` is true when the phase is `open` and a slot is free. A locked, generating or hosting lobby still answers, with `joinable: false`.
- `requires.capabilities` lists what a client must declare. `limits` are the upload limits, so a client can check its files first.
- The reply holds no member list, no member count, no token, no password and no room address.
- A wrong code gets `lobby-not-found` and a close with `4404`. A closed lobby gets `lobby-closed` and `4410`. No common protocol major gets `protocol-unsupported` and `4401`.
- Because the exchange needs no proof, it is limited. A `lobby.info` request MUST be at most 1 024 bytes, else the server answers `bad-message` and closes with `4400`. A server answers at most 30 `lobby.info` requests per minute per source address (`LOBBY_INFO_LIMIT`). The 31st gets `rate-limited` with `retryAfter` and a close with `4429` (see the back-off below). A wrong code in a `lobby.info` request counts as a failed attempt in the same counter as a wrong code in `hello` (see the checks below).
- After the reply the connection stays open. The 15 s timer for `hello` starts again at the reply. A client that wants no more can close.

## Handshake

The client speaks first, with `lobby.info` or `hello`, within 15 s of the connection opening.

```json
{
  "type": "hello", "seq": 2,
  "protocol": { "name": "archipelia-lobby", "versions": [1] },
  "lobby": { "code": "K7QM-4XT2" },
  "resume": null,
  "client": {
    "id": "relic-of-the-past",
    "name": "Relic of the Past",
    "version": "0.22.0",
    "build": "c44b2c1",
    "platform": { "os": "windows", "arch": "x64" },
    "homepage": "https://github.com/drizztdourden08/relic-of-the-past",
    "sdk": { "name": "@drizztdourden08/archipelia-lobby-protocol", "version": "1.0.1" }
  },
  "player": { "displayName": "Link" },
  "archipelago": { "version": "0.6.8" },
  "capabilities": ["slots.yaml", "worlds.upload"],
  "worlds": [
    {
      "game": "Relic of the Past",
      "module": "relic_of_the_past",
      "worldVersion": "0.1.0",
      "sha256": "<64 hex>",
      "size": 812345,
      "proof": { "method": "github-attestation", "bundle": { "...": "Sigstore bundle JSON" } }
    }
  ],
  "slots": [
    { "name": "Link", "game": "Relic of the Past", "yaml": { "sha256": "<64 hex>", "size": 4210 } }
  ]
}
```

### Mandatory metadata

A `hello` missing any field below, or carrying one that is malformed, is refused with `metadata-missing`, naming the field in `field`, and closed with `4400`. This holds for every client, listed or not.

| Field | Rule |
| --- | --- |
| `protocol.name`, `protocol.versions` | as in the section on versioning |
| `lobby.code` | 8 characters of Crockford base32, case-insensitive, one optional `-` after the 4th |
| `client.id` | `[a-z0-9][a-z0-9-]{1,63}`; for a listed client, its registry id |
| `client.name` | 1 to 64 printable characters |
| `client.version` | SemVer 2.0 |
| `client.platform.os`, `client.platform.arch` | `windows`, `macos`, `linux`, `android`, `web`, `other`; `x64`, `arm64`, `other` |
| `player.displayName` | 1 to 32 printable characters |
| `archipelago.version` | the one Archipelago version the client runs, `X.Y.Z` |
| `capabilities` | includes `slots.yaml` |
| `slots` | 1 to 8 entries; `name` 1 to 16 printable characters; `game` exactly as the world names it |
| `worlds` | one entry per game the slots use, when the client has `worlds.upload`; else empty |

Optional: `client.build` (a commit or build id), `client.homepage` (https URL), `client.sdk`, `resume`, `worlds[].proof`.

`checkHello` checks the rules that a schema cannot hold (the required capability, one world per game, a world for every slot game).

### What the server checks, in order

1. Protocol: the offered majors against the supported ones.
2. Lobby code. A wrong code gets `lobby-not-found` and a close with `4404`. The server counts failures per source address, in `hello` and in `lobby.info` together: past 10 in a minute it answers `rate-limited` with `retryAfter` and closes with `4429`.
3. Lobby phase. `closed` gets `lobby-closed` (`4410`). `locked`, `generating` and `hosting` refuse a new member with `lobby-locked`, but accept a resume. A lobby with no free slot gets `lobby-full`.
4. Metadata, as above.
5. The token, when `resume` is set (see the section on the member token).
6. Version: the Archipelago version of the client equals the lobby version. Failure: `version-mismatch`, close `4409`.
7. Trust (see the section on the trust proof). Failure: `trust-failed`, `client-revoked` or `unlisted-not-allowed`, close `4403`.
8. Slot names unique in the lobby (`slot-name-taken`, not fatal: the client may send `slots.set`).
9. World versions agree with the lobby (`world-version-conflict`, close `4409`).

### The welcome

```json
{
  "type": "welcome", "re": 2,
  "protocol": { "name": "archipelia-lobby", "version": 1 },
  "server": { "name": "Archipelia", "version": "0.9.0" },
  "lobby": {
    "id": "lb_8f3a1c", "name": "Friday seed",
    "engine": { "ap": "0.6.8" },
    "admission": "host-approval",
    "allowUnlisted": false,
    "phase": "open"
  },
  "member": { "id": "m_2", "token": "<opaque, 43 chars>", "admission": "pending", "trust": "verified" },
  "need": ["<sha256 of the apworld>", "<sha256 of the yaml>"],
  "limits": {
    "maxMessageBytes": 1048576, "chunkBytes": 262144,
    "maxWorldBytes": 67108864, "maxYamlBytes": 262144, "maxMemberBytes": 134217728
  }
}
```

`need` lists the files the server does not already hold, by hash. Files are content-addressed, so a reconnect or a second member with the same apworld uploads nothing twice.

## The member token and the resume path

The token is how a client comes back. A client may persist it in its own configuration and resume on its next start, days later, as long as the lobby lives.

- `member.token` is 43 URL-safe characters (256 bits). The server stores only a hash of it (`hashToken`, SHA-256 of the text).
- The client stores the token with the server address, the lobby code and the member id. It never puts the token in a URL or a query string, and never logs it.
- To resume, the client opens a connection, sends `hello` with the same mandatory metadata and `resume` set to the token. The `lobby.code` is still required.
- The server finds the member by the token hash inside that lobby and answers `welcome` with the current state of that member: `member.admission` is `pending`, `approved` or whatever changed while the client was away, `member.resumed` is `true`, the member id and the token are the same as before, and `need` lists only the files still missing. A client that was approved while offline learns it in this `welcome`. It does not wait for an `admission` event.
- A resumed member keeps its id, its admission and its uploads. A pending member that resumes is still pending. A client MAY resume at any time, including after the lobby locked or started.
- Version and trust are checked again on resume, because the client may have been updated. The `slots` and `worlds` of the resume `hello` replace the stored ones while the lobby is `open`. After the lobby locks they must match the stored ones, else the server sends `lobby-locked` (not fatal) and keeps the stored list.
- A token the lobby does not know gets `resume-invalid`, fatal, close `4403`. The client MUST delete its stored token and tell the player to join again with the lobby code. A closed lobby gets `lobby-closed`.
- A member that the host refused or removed gets `refused`, fatal, close `4403`, with the reason in the message. The client MUST delete its token.
- A member can have one live connection. A second connection that resumes the same member takes over: the server sends the first connection `resume-replaced` (fatal) and closes it with `4412`.
- After `lobby.started` a resume gets `lobby.started` again at once, and later `room.status` events.
- `leave` ends the membership and deletes the token and the files.

`resumeOutcome` turns a stored member (or none) into the right answer.

## Trust proof

### What is proved

The proof covers the apworld bytes, because the apworld is the only code the server runs. The YAML is data that the trusted world reads. The client binary itself is not proved: a copy of a genuine signed apworld sent by another program still runs only the genuine code.

### Method github-attestation

- The release workflow of the client attests the apworld with GitHub artifact attestations (`actions/attest-build-provenance`), which signs through Sigstore with the workflow's own identity. There is no key to keep.
- The client ships the Sigstore bundle (`<file>.sigstore.json`, bundle media type `application/vnd.dev.sigstore.bundle.v0.3+json`) next to its apworld and sends it inline as `worlds[].proof.bundle`. A bundle is a few kilobytes.
- The server verifies, offline once it holds the Sigstore trusted root:
  1. The signature chain of the bundle to the Sigstore public-good Fulcio root, and its Rekor inclusion proof, against the trusted root. The server refreshes the trusted root through the Sigstore TUF repository when it is online, at most daily, and keeps the last good copy.
  2. The certificate issuer is `https://token.actions.githubusercontent.com`.
  3. The source repository of the certificate is the `repo` of the registry entry, and its build signer URI is `https://github.com/<repo>/<workflow>@<ref>` with `<workflow>` and `<ref>` matching the entry.
  4. The subject digest of the in-toto statement equals the SHA-256 of the uploaded apworld, and the predicate type is SLSA provenance v1.
  5. The `game` in the `archipelago.json` of the apworld is in the `games` of the registry entry.
- A client that claims a registry `client.id` and fails any step is refused with `trust-failed`. It is never downgraded to unlisted, because that would let anyone wear a listed name.
- A registry entry with `status: "revoked"` is refused with `client-revoked`.

### No proof

`proof` absent, or `{ "method": "none" }`, makes the member `unlisted`. The lobby admits it only with `allowUnlisted: true`, else `unlisted-not-allowed`. Its `client.id` MUST NOT be a registry id. Its worlds then need the consent of the host before they run.

### Reserved

`{ "method": "ed25519", "keyId": "...", "signature": "<base64>" }` is reserved for a client that cannot use GitHub Actions. A version 1 server answers it as no proof.

## Version matching

- The lobby declares one Archipelago version, `lobby.engine.ap`. The server generates and hosts with exactly that engine.
- The client runs one Archipelago version and declares it in `archipelago.version`. It MUST equal the lobby version. There is no range, no minimum and no maximum: a newer or an older version is refused alike.
- The refusal is `version-mismatch`, fatal in `hello`, close `4409`. It names the version of the lobby in the text and in the field `lobbyAp`, so the client can switch and retry. `checkClientVersion` builds it:
  `This lobby runs Archipelago 0.6.9. Relic of the Past 0.22.0 runs Archipelago 0.6.8. Switch to Archipelago 0.6.9 and join again.`
- A client that wants to avoid the refusal asks `lobby.info` first and reads `lobby.engine.ap`.
- The `archipelago.json` of each world carries `minimum_ap_version` and `maximum_ap_version`. When present, they MUST hold the lobby version. The server reads them after the upload and refuses the slot with `version-mismatch` (not fatal, with `slot`) when they do not. `checkWorldRange` builds the sentence.
- Inside one lobby every slot of one game uses one world. The first accepted world of a game fixes its `worldVersion`. A later world of the same game with another `worldVersion` is refused with `world-version-conflict`. Same version with other bytes: if both are verified the first stays, else the new one is refused. The world version is independent of the Archipelago version and of the protocol version. `checkWorldVersion` builds the sentence.

## Uploads

### Flow

```text
C: { "type": "upload.begin", "seq": 3, "sha256": "<h>", "kind": "world", "size": 812345 }
S: { "type": "upload.ready", "re": 3, "sha256": "<h>", "offset": 0 }
C: { "type": "upload.chunk", "sha256": "<h>", "offset": 0, "data": "<base64 of up to chunkBytes>" }
C: { "type": "upload.chunk", "sha256": "<h>", "offset": 262144, "data": "..." }
...
S: { "type": "upload.done", "sha256": "<h>", "ok": true }
```

- `kind` is `world` or `yaml`. The hash and size MUST match an entry of `hello` (or `slots.set`), else `upload-unexpected`.
- Chunks go in order with no gap. `offset` in `upload.ready` is where to resume: after a dropped connection the client sends `upload.begin` again and continues from that offset.
- When the size is reached, the server checks the hash. A mismatch drops the partial file and sends `upload-hash-mismatch`. The client MAY retry once.
- Limits: `maxWorldBytes` (64 MiB), `maxYamlBytes` (256 KiB), `maxMemberBytes` (128 MiB) for all the files of a member. A declared size above a limit is refused at `upload.begin` with `upload-too-large`. A stream past the declared size gets `bad-message`.
- One upload at a time per connection.
- Order: the client uploads the world first, then the YAML. A world that the lobby refuses (version, trust, range) then ends the join before a YAML is sent. A file the server already holds is not asked for again, so `need` can be empty. A client uploads exactly the hashes in the last `need` it received (`welcome` or `slots.ok`), in the order of that list.

### What the server does with a file

- Before approval, it stores the bytes in quarantine and checks size and hash only. It verifies the trust proof, which is pure signature checking. It parses nothing else and runs nothing.
- After approval, it reads the apworld as a zip (one top-level package, `archipelago.json`), checks its `game`, `world_version` and Archipelago range against `hello`, and parses each YAML with a safe YAML loader: exactly one document, `name` equal to the slot name, `game` equal to the slot game. A failure gives `world-invalid` or `yaml-invalid` for that slot.
- A world runs (schema read, generation, hosting) only after approval, and for an unlisted world only after consent.

### Consent for unlisted worlds

The host sees the game, version, size and hash of the world and the member who sent it, with the warning that it is Python code that runs on the server. The host allows or refuses each world. A refused world refuses its slots with `consent-refused`, not fatal for the other slots of the member.

### Changing slots

Before the lobby locks, a member MAY replace its slot list:

```json
{ "type": "slots.set", "seq": 7, "slots": [ ... ], "worlds": [ ... ] }
```

The server answers `slots.ok` with a new `need` list, or an error. After `locked`, `slots.set` gets `lobby-locked`, not fatal.

## Admission states

```text
            hello ok                     host approves
 (connect) ---------> pending -------------------------> approved
                         |                                  |
                         | host refuses                     | host removes
                         v                                  v
                      refused                            removed
```

- With `admission: "open"` an accepted `hello` goes straight to `approved`.
- With `admission: "host-approval"` it waits in `pending` until the host decides.
- The server sends every change:

```json
{ "type": "admission", "state": "approved" }
{ "type": "admission", "state": "refused", "reason": "Not in this group" }
```

- `refused` and `removed` are final for that member. The server sends the message, then closes with `4403`. The files of a refused member are deleted.
- A member in `pending` may stay connected or leave and resume later. It is not ready and blocks nothing. The host may start without it.

## Lobby state

The server sends the whole public view on join and on any change. `rev` grows by one each time.

```json
{
  "type": "lobby.state", "rev": 14,
  "phase": "open",
  "engine": { "ap": "0.6.8" },
  "members": [
    {
      "id": "m_1", "displayName": "Host", "client": { "name": "Archipelia", "version": "0.9.0" },
      "trust": "verified", "admission": "approved", "ready": true,
      "slots": [ { "name": "Alice", "game": "A Link to the Past", "state": "ok" } ]
    },
    {
      "id": "m_2", "displayName": "Link", "client": { "name": "Relic of the Past", "version": "0.22.0" },
      "trust": "verified", "admission": "approved", "ready": true,
      "slots": [ { "name": "Link", "game": "Relic of the Past", "state": "ok" } ]
    }
  ]
}
```

- `phase`: `open` (joins accepted), `locked` (no new members), `generating`, `hosting`, `closed`, `failed`.
- `trust`: `verified` or `unlisted`.
- Slot `state`: `uploading`, `checking`, `waiting-consent`, `ok`, `refused` (with `reason`).
- A pending member sees only its own entry, and an `others` object with the counts `approved` and `pending` of the other members.
- The client marks itself ready when its uploads are done: `{ "type": "ready", "seq": 9, "ready": true }`. Ready is advisory. The host decides when to start.
- A resumed member does not send `ready` again when its own entry in the first `lobby.state` after the `welcome` already has `ready: true`. It sends `ready` only when that entry says `ready: false` and its uploads are done.
- `{ "type": "leave" }` ends the membership and deletes its files.

## Start and results

When the host starts, the server locks the lobby, generates with the lobby engine, then opens the room. Members get progress:

```json
{ "type": "lobby.progress", "phase": "generating", "step": "generate", "fraction": 0.4 }
```

On success each approved member gets its own results:

```json
{
  "type": "lobby.started",
  "seed": "12345678901234567890",
  "engine": { "ap": "0.6.8" },
  "room": {
    "address": "archipelago.gg:38281",
    "host": "archipelago.gg", "port": 38281,
    "tls": "auto",
    "password": "s3cret-words",
    "roomUrl": "https://archipelago.gg/room/AbCdEf"
  },
  "slots": [
    { "name": "Link", "game": "Relic of the Past", "team": 0, "files": [] }
  ]
}
```

- `room.tls` is `yes`, `no` or `auto` (try `wss://`, then `ws://`). `password` is absent for a room without one. Only approved members of this lobby receive it.
- `room.localAddress` (optional) is present when the room runs on the computer of the server. It is the loopback address of the room, `127.0.0.1:<port>`. A client that joined the lobby through a loopback address, so it runs on the same computer as the server, SHOULD use `localAddress` instead of `address`. A client on another computer MUST ignore it.
- `files` lists any per-slot output (patch files for games that need one): `{ fileId, name, size, sha256 }`. The client fetches one with `{ "type": "file.get", "seq": n, "fileId": "f_1" }` and receives `file.chunk` messages (`fileId`, `offset`, base64 `data`) then `file.done` with the hash.
- A member that connects or resumes after the start gets `lobby.started` again at once.
- Later room changes: `{ "type": "room.status", "state": "hosting" | "stopped", "address": "..." }`. A room that moves (restart on another port) sends the new address.
- A failure: `{ "type": "lobby.failed", "stage": "generate", "message": "..." }`, phase `failed`. The host may fix the cause and start again, which reopens `locked`.

## Errors

```json
{ "type": "error", "re": 3, "code": "upload-too-large", "message": "The world is 80 MiB. This lobby takes 64 MiB.", "fatal": false }
```

- `code` is stable and machine-readable. `message` is plain English for the player.
- `fatal: true` means the server closes the connection right after, with the close code below.
- Optional fields: `field` (the bad field), `retryAfter` (seconds), `supported` (protocol majors), `slot` (the slot concerned), `lobbyAp` (the Archipelago version of the lobby, on `version-mismatch`).

| Code | Fatal | Close | Meaning |
| --- | --- | --- | --- |
| `bad-message` | yes before welcome, else no | 4400 | not JSON, too large, wrong shape, unknown type, binary frame |
| `protocol-unsupported` | yes | 4401 | no common protocol major |
| `metadata-missing` | yes | 4400 | a mandatory field is missing or malformed |
| `lobby-not-found` | yes | 4404 | wrong code |
| `lobby-closed` | yes | 4410 | the lobby ended |
| `lobby-locked` | yes before welcome, else no | 4410 | no new members, or slots frozen |
| `lobby-full` | yes | 4410 | the slot limit of the lobby is reached |
| `version-mismatch` | yes before welcome, else per slot | 4409 | the version rule |
| `world-version-conflict` | yes before welcome, else per slot | 4409 | the world version rule |
| `trust-failed` | yes | 4403 | proof does not verify for a listed id |
| `client-revoked` | yes | 4403 | the registry revoked this client |
| `unlisted-not-allowed` | yes | 4403 | no proof and the lobby takes listed clients only |
| `refused` | yes | 4403 | the host refused or removed the member, seen on resume |
| `resume-invalid` | yes | 4403 | the token is unknown to this lobby |
| `resume-replaced` | yes | 4412 | another connection took over this member |
| `slot-name-taken` | no | none | another slot has the name |
| `upload-unexpected` | no | none | hash or kind not declared |
| `upload-too-large` | no | none | over a limit |
| `upload-hash-mismatch` | no | none | bytes do not match the hash |
| `yaml-invalid` | no | none | YAML rules of the upload section |
| `world-invalid` | no | none | apworld rules of the upload section |
| `consent-refused` | no | none | the host refused an unlisted world |
| `rate-limited` | yes | 4429 | too many attempts, see `retryAfter` |
| `internal` | no | none | server fault, the message says what to tell the host |

`resume-invalid` and `resume-replaced` are additive codes of this version. A refused member that is connected sees `admission` with the state `refused` and then the close. The error `refused` is what a refused member gets when it resumes.

A close with `4429` is always preceded by the `rate-limited` error, and that error always carries `retryAfter`, the whole seconds to wait before the next `lobby.info` or `hello` from the same address. The close frame itself carries no reason text. A client that sees `4429` without having read the error (the error was lost, or the client only watches close codes) MUST wait 60 seconds, the length of both counting windows (`LOBBY_INFO_WINDOW_MS` and `WRONG_CODE_WINDOW_MS`), and SHOULD double the wait after each further `4429`, up to 15 minutes.

`ERROR_RULES` holds this table in code, `createError` builds the message with the right `fatal` flag, and `closeCodeOf` gives the close code.

## Example: RotP joins a lobby with host approval

The host created lobby `K7QM-4XT2` on Archipelago 0.6.8 with host approval on and unlisted clients off. The player creates a RotP profile with randomizer mode Archipelia. RotP runs Archipelago 0.6.8.

```text
C  lobby.info   seq 1, code K7QM-4XT2, protocol [1]
S  lobby.info.reply  re 1, engine 0.6.8, phase open, joinable, host-approval
     (RotP compares 0.6.8 with the version it runs and goes on. A client that runs
      another version stops here and asks the player to install 0.6.8.)
C  hello        seq 2, client relic-of-the-past 0.22.0, archipelago 0.6.8,
                worlds [Relic of the Past 0.1.0, sha W, proof bundle], slots [Link, yaml sha Y]
S  welcome      re 2, lobby engine 0.6.8, admission host-approval,
                member m_2 token T, admission pending, trust verified, need [W, Y]
S  lobby.state  rev 9, only m_2 visible, counts of the others
C  upload.begin seq 3, W, world, 812345
S  upload.ready re 3, W, offset 0
C  upload.chunk W, offset 0 ... offset 786432
S  upload.done  W, ok
C  upload.begin seq 4, Y, yaml, 4210
S  upload.ready re 4, Y, offset 0
C  upload.chunk Y, offset 0
S  upload.done  Y, ok
     (RotP stores server, code and token T in its profile configuration and finishes
      profile creation. The profile card shows "Waiting for the host to approve".)
     (The host sees Link, Relic of the Past 0.22.0, Verified, and approves.)
S  admission    approved
S  lobby.state  rev 10, all members; slot Link checking
S  lobby.state  rev 11, slot Link ok
C  ready        seq 5, true
     (RotP closes the app. Later it starts again and resumes.)
C  hello        seq 1, same metadata, resume T
S  welcome      re 1, member m_2, token T, admission approved, resumed, need []
S  lobby.state  rev 12
     (The host starts.)
S  lobby.progress generating, generate, 0.4
S  lobby.progress hosting, upload-room, 0.9
S  lobby.started room archipelago.gg:38281, tls auto, password P, slots [Link, team 0, no files]
     (RotP writes serverUrl, slot name Link and password P into the profile and switches it to
      its online mode. Its Archipelago client connects to wss://archipelago.gg:38281.)
C  leave        (optional; RotP keeps the token to receive room.status while the profile is open)
```

A refusal for a RotP build that runs another Archipelago version, on the same lobby. The text names the version of the lobby:

```text
C  hello  archipelago 0.6.7
S  error  code version-mismatch, fatal, lobbyAp 0.6.8,
          "This lobby runs Archipelago 0.6.8. Relic of the Past 0.21.1 runs Archipelago 0.6.7. Switch to Archipelago 0.6.8 and join again."
S  close  4409
```

This exchange is the fixture `approval-join`. The fixture `lobby-info` is the first two lines alone.

## Finding a server on the local network

Discovery is a record, not a protocol. This package builds and parses the record. It opens no socket and carries no mDNS library: the server piece does the advertising and the listening.

### DNS-SD over mDNS

A server advertises the service `_archipelia._tcp` (`DISCOVERY_SERVICE`). The SRV record gives the host and the lobby port. The TXT record carries five keys, all strings:

| Key | Value |
| --- | --- |
| `name` | the name of the server, 1 to 64 printable characters |
| `id` | a stable id of the server, 4 to 64 characters of `A-Z a-z 0-9 _ -` |
| `proto` | the highest protocol major the server speaks, a positive integer |
| `ap` | the exact Archipelago version of the engine, `X.Y.Z` |
| `open` | `1` when at least one lobby is open to join, else `0` |

Every TXT value MUST be at most 255 bytes. `buildDiscoveryTxt(record)` returns the key and value map. `parseDiscoveryTxt(map)` returns `{ ok: true, record, compatible }` or `{ ok: false, reason, detail }`. `compatible` is false when `proto` is a major this package does not speak. The record is still returned, so a client can tell the player that the server needs a newer client. A record with a missing or malformed key gives `reason: "malformed"`, and a value over 255 bytes gives `reason: "too-large"`.

The record says nothing about a lobby code, a member or a lobby name. The player still needs the code to join. A client uses the record to fill in the address without typing it, then speaks `lobby.info` to that address.

### UDP broadcast beacon

A network that blocks multicast can still pass a broadcast. The fallback is a small JSON datagram sent to the broadcast address of each local interface, to UDP port `38291` (`BEACON_PORT`), every 5 s (`BEACON_INTERVAL_MS`). A listener forgets a server after 15 s of silence (`BEACON_EXPIRY_MS`).

```json
{ "app": "archipelia", "name": "Friday seed server", "id": "srv_4f2a9c", "protocol": 1, "ap": "0.6.8", "open": true, "port": 38290 }
```

- The fields are the five of the TXT record, with `protocol` and `open` typed, plus `app` (always `archipelia`) and `port` (the lobby port, 1 to 65535). The sender address of the datagram is the host.
- A datagram MUST be at most 512 bytes (`BEACON_MAX_BYTES`). `buildBeacon` throws on a larger one. `parseBeacon` refuses a larger one before it parses anything.
- `parseBeacon(datagram)` takes a string or bytes and returns the same outcome as `parseDiscoveryTxt`, with `reason` one of `too-large`, `not-json`, `wrong-app` or `malformed`. Other traffic on the port is told apart by `app`.
- A beacon is unauthenticated, like the lobby.info exchange. A listener treats it as a hint and still verifies everything through the protocol.

### No relay

There is no relay and no rendezvous service. Discovery works on one local network. Reaching a host over the internet is the setup of the host: a public machine, a port forward on the router, or a room on archipelago.gg while the lobby stays on the local network. The server never forwards traffic for another.

## Admin API (host side, outline)

Not needed by game clients. The desktop app uses it to manage a server.

- Path `/archipelia/admin` on the same port, same framing. The first message is `{ "type": "admin.hello", "token": "<admin token>", "protocol": {...} }`.
- Plain `ws://` admin is refused unless the peer is loopback. Remote admin needs `wss://`, and the desktop pins the SHA-256 of the server certificate when it adds the server.
- Requests: `server.info`, `engine.list`, `engine.install`, `engine.switch`, `lobby.create`, `lobby.update`, `lobby.lock`, `lobby.start`, `lobby.close`, `member.approve`, `member.refuse`, `member.remove`, `world.consent`, `room.command`, `room.stop`, `log.follow`.
- Events: `lobby.state` with full detail (hashes, proof result, client metadata), `job.update`, `log.line`.

## Conformance

The package holds the JSON Schemas (draft 2020-12) of every message, the error codes and transcript fixtures. A client is conformant when it passes every scenario that applies to its capabilities. Archipelia and RotP run the same fixtures in their own test suites.

### Schemas

`CLIENT_SCHEMAS` and `SERVER_SCHEMAS` map a message type to its schema. Every schema is a self-contained document with the shared `$defs`. The package validates with its own small validator (`validateSchema`, `validateMessage`), which supports the keywords the schemas use: `type`, `const`, `enum`, `pattern`, `minLength`, `maxLength`, `minimum`, `maximum`, `required`, `properties`, `items`, `minItems`, `maxItems`, `oneOf` and local `$ref`. The schemas are plain objects, so any draft 2020-12 validator accepts them as well. Unknown fields are never rejected.

`decodeMessage(text, { direction, maxBytes })` parses, applies the size limits and validates in one call. It answers a failure as a protocol error: `bad-message` for most shapes and `metadata-missing`, with the field, for a bad `hello`. An unknown type from the server comes back as `known: false` for the client to ignore.

### Fixture format

A fixture is a file `fixtures/<scenario>.jsonl`. Each line is one JSON object:

| Line | Meaning |
| --- | --- |
| `{ "dir": "c2s", "msg": {...} }` | the client sends this message |
| `{ "dir": "s2c", "msg": {...} }` | the server sends this message |
| `{ "dir": "c2s", "raw": "text" }` | the client sends this text as is, not JSON |
| `{ "dir": "c2s", "binary": true }` | the client sends a binary frame |
| `{ "dir": "close", "code": 4403 }` | the server closes the connection with this code |
| `{ "dir": "connect" }` | the client drops the connection and opens a new one |
| `{ "dir": "host", "action": "approve" }` | the host does something (see below) |
| `{ "dir": "repeat", "times": 10, "lines": [...] }` | the lines are expanded `times` times when the file is read |

A line with `"invalid": true` carries a message that breaks the schema on purpose, so the peers do not validate it.

The `host` actions used by the scenarios are `approve`, `refuse` (with `reason`), `lock`, `start`, `consent` (with `world` and `allowed`) and `takeover`. The fake server skips them. A test of a real server passes a hook to the fake client and does the action there.

The lines `close`, `connect`, `host`, `raw`, `binary`, `repeat` and `invalid` extend the plain message list. They are additive and live in the fixtures only, never on the wire.

### Placeholders

A string value of the form `$name` is a placeholder.

- The side that sends replaces it with a value. The client takes its values from the scenario kit (`$W` is the hash of the apworld, `$W_size` its size, `$Y` and `$Y_size` the YAML, `$U` and `$UY` an unlisted world and its YAML, `$proof` the proof, `$Y2` a second YAML, `$BIG` and `$BIG_size` a world over the limit, `$MISSING` an undeclared hash). The server makes `$token` and the ids it owns.
- The side that receives binds an unbound placeholder to the value it sees and requires every later use to repeat that value. This is how the token of the first `welcome` returns in the `hello` that resumes.
- `$data` is the right chunk of the file named by the `sha256` and `offset` of the message. `$bad_data` is a chunk of the right size with wrong bytes.
- Wildcards accept any value of a kind and bind nothing: `$any_int`, `$any_num`, `$any_str`, `$any_tls`.
- An object `{ "$has": X }` inside a list means that the list holds an entry that matches `X`, in any position. A list made only of such objects is checked this way.
- A receiver ignores fields that the fixture does not name. The scenarios assume the default limits of `DEFAULT_LIMITS`.

### Scenarios

`SCENARIO_CATALOG` lists every scenario with the setup a real server needs for it (lobby name, admission, whether unlisted clients are allowed, the Archipelago version, the phase, the slot limit, slots held by other members, the registry state, and the output file for `file-download`).

| Group | Scenarios |
| --- | --- |
| lobby.info | `lobby-info`, `lobby-info-unknown-code`, `lobby-info-closed`, `lobby-info-locked`, `lobby-info-protocol-unsupported`, `lobby-info-rate-limit`, `lobby-info-oversize` |
| joining | `open-join`, `approval-join`, `refused`, `unlisted-consent`, `slots-set`, `file-download`, `start-failure` |
| resume | `upload-resume`, `resume-after-start`, `resume-pending`, `resume-invalid`, `resume-refused`, `resume-replaced` |
| version and trust | `version-mismatch`, `world-version-conflict`, `world-range-mismatch`, `trust-failed`, `client-revoked`, `unlisted-refused` |
| lobby state | `lobby-closed`, `lobby-locked`, `slots-set-locked`, `lobby-full`, `slot-name-taken` |
| uploads and files | `upload-unexpected`, `upload-too-large`, `upload-hash-mismatch`, `yaml-invalid`, `world-invalid`, `consent-refused` |
| protocol | `protocol-unsupported`, `wrong-code-rate-limit`, `bad-message-prewelcome`, `bad-message-binary`, `bad-message-after-welcome`, `metadata-missing`, `internal-error` |

A catalog entry may carry two more facts. `setup.heldFiles` is true when the server already holds the apworld and the YAML before the client joins, as when another member sent the same files, so the `welcome` says `need: []` and the script uploads nothing. `serverSideOnly` marks a scenario that a conforming client cannot play, because the client would have to send a frame that the protocol forbids. `bad-message-binary` and `bad-message-after-welcome` are such scenarios. A client test skips them, and a server test plays them.

The scenario `approval-join` is the RotP example exchange above. Every error code has at least one scenario.

### The fake server and the fake client

Both play a scenario from opposite ends and fail on the first line that breaks the schema, the order or the values.

```ts
import { createFakeServer, loadScenario } from '@drizztdourden08/archipelia-lobby-protocol/testing';

const server = createFakeServer({ scenario: loadScenario('approval-join') });
const listener = await server.listen();
// point the client under test at listener.url, then:
const result = await server.done; // { ok, failure?, bindings }
await listener.stop();
```

- `createFakeServer({ scenario })` returns `{ attach, listen, done }`. `listen(port?, host?)` opens a real `ws://` listener on the loopback address (a free port by default) and returns its `url`. `attach(transport)` takes a connection that the test made itself. `done` resolves with the result of the whole scenario and never rejects.
- `createFakeClient({ scenario, connect })` returns `{ play }`. `connect` returns a transport, for example `() => connectWebSocket(url)`. Options: `kit` (the files and values it sends), `host` (the hook for host lines), `ignore` (message types to skip when they arrive unexpectedly, such as `lobby.state`), `timeoutMs`.
- `runScenario(scenario)` plays both in memory and returns both results.
- The fake server needs no mDNS and no database. A RotP test runs its own client against it for each scenario that applies to its capabilities.
- Archipelia tests the real server by running the fake client against it for every scenario, with a host hook that drives the admin API.

A scenario fails with a text such as `line 12 (s2c): members[0].id: expected "m_2" ($member), got "m_9"`. The line number counts after the `repeat` expansion.

### Checks the tests make

- Every scenario plays between the fake client and the fake server, in memory, and a selection of them over a real WebSocket.
- Every fixture message validates against the schemas, once the placeholders take sample values.
- The sentences of the fixtures equal the sentences that `checkClientVersion`, `checkWorldRange`, `checkWorldVersion`, `negotiateProtocol` and `resumeOutcome` build. The version refusal names the lobby version.
- Every error code has a row in the table above, the right fatal flag and the right close code.
- The `lobby.info` reply holds no member data, the request has its size limit, and the 31st request in a minute is rate limited.
- The discovery record and the beacon parse, reject an unknown protocol version as incompatible, and reject an oversize datagram.

## Changes

- 1.2.0: `lobby.started` carries an optional `room.localAddress`, the loopback address of a room that runs on the computer of the server. A client that joined through a loopback address SHOULD use it. The change is additive, so protocol major 1 is unchanged.
- 1.1.0: the socket transport has a client-side masking option.
