<!-- @layer core @kind doc -->

# @archipelia/sessions

Templates, run history, player files, and the service that takes a session from generate to hosting.

## Console command catalog

`src/console-commands` is the typed catalog of every command the host console of the Archipelago server accepts, with an icon, a group and purpose-made parameters for each. It is data only. The session console picker reads it through `@archipelia/sessions/console-commands`.

Source: `ServerCommandProcessor` and the shared `CommonCommandProcessor` and `CommandProcessor` in `MultiServer.py`, Archipelago 0.6.7. The client only `!` commands (`admin`, `missing`, `checked`, `getitem`) are not host console commands and are left out.

| Group | Commands |
|---|---|
| Players | players, status, alias |
| Items and hints | send, send_multiple, send_location, hint, hint_location |
| Room | release, collect, allow_release, forbid_release, countdown |
| Server | help, license, options, option, save, datastore, exit |

That is 20 commands. `release`, `collect` and `exit` carry `confirm: true`.

A parameter with a `source` is filled at run time: `players` from the room, `items` and `locations` from the datapackage of the game of the chosen player (named by `dependsOn`), and `options` from `SERVER_OPTIONS`. Each command has a `format(values)` that builds the exact line. Commands the server reads as raw text (`release`, `collect`, `alias`, `allow_release`, `forbid_release`) get the player name unquoted. Commands the server splits as words get names with spaces in double quotes.
