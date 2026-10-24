<!-- @layer docs @kind doc -->
# Archipelia server

The headless lobby server. It is the `server` target of the desktop app: `server/main.ts` runs
under Brock's `runServer`, with the same core the desktop embeds (`@archipelia/server`).

## Run it

```text
archipelia launch server none          a dev launch from a worktree
node dist/server/main.mjs --user-data=<folder>
archipelia-server [command]            the packaged launcher (tarball, .deb, Docker image)
```

Commands: `start` (the default), `token` (prints the admin token file path), `status`,
`engine list`, `engine install <ap> [--python <version>]`, `engine switch <id>`,
`engine remove <id>`, `health` and `help`.

## Settings

A TOML file and the environment. The environment wins. The file is `--config=<file>`, else
`ARCHIPELIA_CONFIG`, else `<data folder>/server.toml`, else `/etc/archipelia/server.toml`.
The data folder is Brock's: `--user-data=`, else `BROCK_DATA_DIR`, else `STATE_DIRECTORY`,
else `./.user-data`.

| Key | Environment | Default |
|---|---|---|
| `port` | `ARCHIPELIA_PORT` | 38290 |
| `network` (`off`, `lan`, `lan-and-internet`) | `ARCHIPELIA_NETWORK` | `lan` |
| `loopback` (bind 127.0.0.1 only) | `ARCHIPELIA_LOOPBACK` | false |
| `publicLookup` (public IP lookup) | `ARCHIPELIA_PUBLIC_LOOKUP` | true |
| `engine.version` | `ARCHIPELIA_ENGINE` | the default engine |
| `engine.python` | `ARCHIPELIA_PYTHON` | the tested Python |
| `engine.auto` (install on start) | `ARCHIPELIA_ENGINE_AUTO` | true |
| `tls.key`, `tls.cert` | `ARCHIPELIA_TLS_KEY`, `ARCHIPELIA_TLS_CERT` | none |
| `tls.selfSigned` | `ARCHIPELIA_TLS_SELF_SIGNED` | true |

## TLS

With no key and certificate configured, the first start makes a self-signed P-256 certificate
under `Data/server/tls/` (key mode 0600, valid ten years, made again 30 days before it ends)
and logs its SHA-256 fingerprint. The desktop pins that fingerprint. The lobby then speaks wss,
which also lifts the "LAN only" limit of the internet modes. `tls.selfSigned = false` with no
pair keeps plain ws.

## Engine

On a machine with no engine, the first start installs the default engine through the same
install path as the desktop (Python and Archipelago from the version feed, then the smoke
check), and logs the progress. `ARCHIPELIA_ENGINE=0.6.8` picks another version. `engine.auto =
false` leaves it to `archipelia-server engine install`.

## Docker

`docker/compose.yaml` is the example. Engines live on the `/data` volume. In a container,
discovery and port mapping do not reach the host network, so the example sets the network to
`off` and publishes the ports itself.

## Waiting on Brock 0.87

- `server.optionalAddons: ['ssh2', 'cpu-features']` in `brock.config.ts`. Until it exists
  `brock server build` (and so `brock build` of this app, the CI `server` job and the release
  `build-server` job) fails on the optional native addon of `ssh2`.
- `resolveDataDir` exported from `@drizztdourden08/brock-electron/server`. Until then
  `server/data/data-folder.ts` follows the documented order for the CLI commands. Replace it
  with the Brock export and delete the file.
