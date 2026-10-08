/* @layer tooling-scripts @kind data */

const OPTIONS_SCHEMA_SOURCE = `"""Prints every loaded world's options as JSON, the GameSchema shape in packages/model/src/options.type.ts.

Run inside the pinned engine with the AP source as the working directory:
    python -X utf8 options_schema.py --out schema.json [--game "A Link to the Past"]
"""
import argparse
import inspect
import json
import os
import sys
import time

sys.path.insert(0, os.getcwd())

from Options import (Choice, FreeText, NamedRange, NumericOption, OptionCounter, OptionDict, OptionList,  # noqa: E402
                     OptionSet, Range, Toggle, Visibility, get_option_groups)
from worlds import AutoWorldRegister, failed_world_loads  # noqa: E402

KINDS = [(NamedRange, "named-range"), (Range, "range"), (Toggle, "toggle"), (Choice, "choice"),
         (FreeText, "text"), (OptionSet, "set"), (OptionList, "list"), (OptionCounter, "counter"),
         (OptionDict, "dict")]
SHOWN = Visibility.template | Visibility.simple_ui | Visibility.complex_ui


def kind_of(cls):
    return next((kind for base, kind in KINDS if issubclass(cls, base)), None)


def plain(value):
    if isinstance(value, (set, frozenset)):
        return sorted(plain(v) for v in value)
    if isinstance(value, (list, tuple)):
        return [plain(v) for v in value]
    if isinstance(value, dict):
        return {str(k): plain(v) for k, v in value.items()}
    return value if isinstance(value, (str, int, float, bool)) or value is None else str(value)


def default_of(cls, kind):
    if kind == "toggle":
        return bool(cls.default)
    if kind == "choice" and isinstance(cls.default, int):
        return cls.name_lookup.get(cls.default, str(cls.default))
    return plain(cls.default)


def describe(key, cls, group):
    kind = kind_of(cls)
    d = {"key": key, "displayName": getattr(cls, "display_name", key), "group": group, "kind": kind,
         "description": inspect.cleandoc(cls.__doc__ or ""), "default": default_of(cls, kind),
         "visibility": [n for n, f in (("simple", Visibility.simple_ui), ("complex", Visibility.complex_ui))
                        if f in cls.visibility],
         "weightable": issubclass(cls, NumericOption)}
    if kind in ("range", "named-range"):
        d["range"] = {"min": cls.range_start, "max": cls.range_end}
    if kind == "named-range":
        d["namedValues"] = dict(cls.special_range_names)
    if kind == "choice":
        d["choices"] = [{"value": name, "label": name.replace("_", " ")} for name in cls.name_lookup.values()]
    keys = getattr(cls, "valid_keys", None)
    if keys:
        d["validKeys"] = sorted(str(k) for k in keys)
    return d


def schema_of(game, world):
    groups = get_option_groups(world, Visibility.none)
    options, unsupported = [], []
    for group, members in groups.items():
        for key, cls in members.items():
            if not (cls.visibility & SHOWN):
                continue
            if kind_of(cls) is None:
                unsupported.append(key)
                continue
            options.append(describe(key, cls, group))
    version = getattr(world, "world_version", None)
    return {"game": game, "worldVersion": version.as_simple_string() if version else "",
            "groups": [g for g in groups if any(o["group"] == g for o in options)], "options": options,
            "presets": plain(world.web.options_presets), "unsupported": unsupported}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", required=True)
    parser.add_argument("--game", action="append")
    args = parser.parse_args()
    started = time.perf_counter()
    schemas, errors = {}, {}
    for game, world in AutoWorldRegister.world_types.items():
        if world.hidden or (args.game and game not in args.game):
            continue
        try:
            schemas[game] = schema_of(game, world)
        except Exception as err:  # noqa: BLE001
            errors[game] = f"{type(err).__name__}: {err}"
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump({"schemas": schemas, "errors": errors, "failedWorlds": list(failed_world_loads),
                   "seconds": round(time.perf_counter() - started, 2)}, f,
                  indent=1, default=str)
    print(f"{len(schemas)} worlds, {len(errors)} errors -> {args.out}")


if __name__ == "__main__":
    main()
`;

export { OPTIONS_SCHEMA_SOURCE };
