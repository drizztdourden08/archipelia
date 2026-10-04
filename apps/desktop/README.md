<!-- @layer docs @kind doc -->
# Archipelia desktop

The Archipelia app: the Archipelago multiworld workflow in one window, built on Brock and
the Tessera design system. It is the `apps/desktop` member of the Archipelia workspace;
the subject packages it composes live in `packages/`.

## Commands

Run from this folder, or from the workspace root with `pnpm --filter @archipelia/desktop <script>`.

```
pnpm dev                 electron-vite dev server and the app, hot reloading
pnpm build               dist/electron, dist/preload, dist/renderer
pnpm start               run the built app
pnpm start:headless      the same, off screen and muted (automation)
pnpm sync                regenerate the managed files after a Brock update
pnpm lint                tsc, eslint, stylelint
```

## Layout

The folders every Brock app shares (screens, widgets, boot tasks, views, stores, hooks, the
IPC contract, the generated `.brock/` files) follow Brock's
[app structure](https://github.com/drizztdourden08/brock/blob/main/docs/app-structure.md).
What is Archipelia's own:

```
packages/model                 the data model: games, options, presets, sessions, hosts, servers
packages/engine                the bundled Archipelago generator, run as hidden child processes
packages/catalog               the community apworld index
packages/presets               per-game option presets and their checks
packages/hosts                 where a server runs: local, archipelago.gg, remote over SSH
packages/sessions              templates, run history, player files, the session service,
                               and the live room parsing (sessions/live-room)
packages/design                the shared Tessera compounds and the app tree of the guide
tooling/engine-bundle          builds the engine: a standalone Python with the pinned Archipelago
electron/services/             the composition: stores and services built from packages/*
electron/engine/, electron/gg/ main-side engine setup and archipelago.gg rooms
src/widgets/                   the session widgets: players, hints, room, log, console, spoiler
src/session-widgets/           the session widget layout and the widget window check
src/search-actions/            the actions the search palette offers
src/rooms/                     the hosting room and the stop confirmation
```

This app is a workspace member, so the workspace root owns `pnpm-workspace.yaml` (the
dependency catalog), `.npmrc` and the lint configs. `electron.vite.config.ts`,
`electron-builder.config.cjs` and `tsconfig.json` here are managed: `brock sync` rewrites
them and `brock check` fails CI when they drift.
