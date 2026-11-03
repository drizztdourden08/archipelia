/* @layer core @kind config */

const ITEM_TYPES_SCRIPT_NAME = 'item_types.py';

const ITEM_TYPES_SCRIPT = `"""Writes the placed items of a generated seed, with their classification flags, as JSON.

Run inside the pinned engine with the AP source as the working directory:
    python -X utf8 item_types.py --zip AP_123.zip --out AP_123_ItemTypes.json
"""
import argparse
import json
import os
import sys
import zipfile
import zlib

sys.path.insert(0, os.getcwd())

from Utils import restricted_loads  # noqa: E402

MULTIDATA_SUFFIX = ".archipelago"
MAX_FORMAT_VERSION = 3
SIDECAR_VERSION = 1


def read_multidata(zip_path):
    with zipfile.ZipFile(zip_path) as archive:
        name = next((entry for entry in archive.namelist() if entry.endswith(MULTIDATA_SUFFIX)), None)
        if name is None:
            raise SystemExit("No .archipelago found in archive.")
        data = archive.read(name)
    if data[0] > MAX_FORMAT_VERSION:
        raise SystemExit("Incompatible multidata.")
    return restricted_loads(zlib.decompress(data[1:]))


def names_by_id(package, key):
    return {number: name for name, number in package.get(key, {}).items()}


def placements_of(multidata):
    slots = multidata["slot_info"]
    packages = multidata.get("datapackage", {})
    items = {game: names_by_id(package, "item_name_to_id") for game, package in packages.items()}
    places = {game: names_by_id(package, "location_name_to_id") for game, package in packages.items()}

    def slot_name(slot):
        return slots[slot].name if slot in slots else str(slot)

    def game_of(slot):
        return slots[slot].game if slot in slots else ""

    rows = []
    for finder in sorted(multidata["locations"]):
        for location_id, entry in sorted(multidata["locations"][finder].items()):
            item_id, receiver = entry[0], entry[1]
            rows.append({
                "finder": slot_name(finder),
                "location": places.get(game_of(finder), {}).get(location_id, str(location_id)),
                "item": items.get(game_of(receiver), {}).get(item_id, str(item_id)),
                "receiver": slot_name(receiver),
                "flags": int(entry[2]) if len(entry) > 2 else 0,
            })
    return rows


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--zip", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    document = {"version": SIDECAR_VERSION, "placements": placements_of(read_multidata(args.zip))}
    partial = args.out + ".part"
    with open(partial, "w", encoding="utf-8") as handle:
        json.dump(document, handle, ensure_ascii=False, separators=(",", ":"))
    os.replace(partial, args.out)


main()
`;

export { ITEM_TYPES_SCRIPT, ITEM_TYPES_SCRIPT_NAME };
