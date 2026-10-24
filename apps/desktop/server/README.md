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
The data folder is Brock's `resolveDataDir`: `--user-data=`, else `BROCK_DATA_DIR`, else `STATE_DIRECTORY`,
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

## Sandbox (bubblewrap)

Unlisted worlds run in bubblewrap. `server.osPackages` puts it in the .deb `Depends` and in the
Docker image. It needs unprivileged user namespaces:

- On the host, `user.max_user_namespaces` above 0. On Ubuntu 24.04 and later also
  `kernel.apparmor_restrict_unprivileged_userns=0`, or an AppArmor profile for `/usr/bin/bwrap`
  with the `userns` permission.
- In a container, Docker's default seccomp and AppArmor profiles refuse the calls bubblewrap
  makes. The compose example sets `seccomp=unconfined`, `apparmor=unconfined` and
  `systempaths=unconfined` (Docker masks parts of `/proc` otherwise), and keeps `cap_drop: ALL`,
  a read-only root and the image user (uid 10001). Swap `seccomp=unconfined` for Docker's
  default profile with `unshare`, `setns`, `clone`, `clone3`, `mount`, `umount2` and `pivot_root`
  allowed. Never use `--privileged` or `--cap-add SYS_ADMIN`: they hand the container what the
  sandbox exists to withhold. The compose example has not been run on a Docker host yet.
- Without a working bubblewrap an unlisted world still waits for the host to allow it, and runs
  with no sandbox.
