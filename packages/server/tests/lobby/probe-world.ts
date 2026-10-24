/* @layer tests @kind test */
import { strToU8, zipSync } from 'fflate';

const PROBE_SOURCE = [
  'import os',
  'import sys',
  '',
  'from BaseClasses import Item, ItemClassification, Location, Region',
  'from worlds.AutoWorld import World',
  '',
  'marker_dir = os.environ.get("ARCHIPELIA_PROBE_DIR")',
  'if marker_dir:',
  '    with open(os.path.join(marker_dir, os.path.basename(sys.argv[0]) + ".loaded"), "w") as marker:',
  '        marker.write(__file__)',
  '',
  '',
  'class ProbeItem(Item):',
  '    game = "Overlay Probe"',
  '',
  '',
  'class ProbeLocation(Location):',
  '    game = "Overlay Probe"',
  '',
  '',
  'class ProbeWorld(World):',
  '    game = "Overlay Probe"',
  '    item_name_to_id = {"Probe Key": 7770001}',
  '    location_name_to_id = {"Probe Chest": 7770001}',
  '',
  '    def create_item(self, name):',
  '        return ProbeItem(name, ItemClassification.progression, self.item_name_to_id[name], self.player)',
  '',
  '    def create_regions(self):',
  '        menu = Region("Menu", self.player, self.multiworld)',
  '        menu.locations.append(ProbeLocation(self.player, "Probe Chest", 7770001, menu))',
  '        self.multiworld.regions.append(menu)',
  '',
  '    def create_items(self):',
  '        self.multiworld.itempool.append(self.create_item("Probe Key"))',
  '',
  '    def set_rules(self):',
  '        self.multiworld.completion_condition[self.player] = lambda state: state.has("Probe Key", self.player)',
  '',
].join('\n');

const PROBE_MANIFEST = { game: 'Overlay Probe', world_version: '1.0.0', version: 7, compatible_version: 7 };

const probeWorld = () =>
  zipSync({
    'overlay_probe/__init__.py': strToU8(PROBE_SOURCE),
    'overlay_probe/archipelago.json': strToU8(JSON.stringify(PROBE_MANIFEST)),
  });

const probeYaml = (name: string) => `name: ${name}\ngame: Overlay Probe\nOverlay Probe: {}\n`;

export { probeWorld, probeYaml };
