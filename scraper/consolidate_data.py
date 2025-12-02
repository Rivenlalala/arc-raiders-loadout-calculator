#!/usr/bin/env python3
"""
Consolidates all scraped data into a clean, unified JSON structure
for the Arc Raiders Loadout Calculator web app.
"""

import json
import os

def load_json(filename):
    """Load a JSON file."""
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def clean_string(s):
    """Clean up string values."""
    if not s:
        return s
    # Remove non-breaking spaces and clean up
    return s.replace('\xa0', ' ').strip()

def clean_materials(materials):
    """Clean up materials list."""
    cleaned = []
    for mat in materials:
        cleaned.append({
            'material': clean_string(mat['material']),
            'quantity': mat['quantity']
        })
    return cleaned

def process_weapons(weapons_data):
    """Process and clean weapons data."""
    weapons = []
    for w in weapons_data:
        weapon = {
            'id': w['name'].lower().replace(' ', '_'),
            'name': clean_string(w['name']),
            'category': w.get('category') or 'Unknown',
            'rarity': w.get('rarity') or 'Common',
            'ammo_type': clean_string(w.get('ammo_type')),
            'modification_slots': w.get('modification_slots', []),
            'crafting': {
                'tier1': {
                    'materials': clean_materials(w.get('base_craft', {}).get('materials', [])),
                    'workshop': clean_string(w.get('base_craft', {}).get('workshop'))
                },
                'upgrades': []
            }
        }

        # Process upgrades
        for upg in w.get('upgrades', []):
            weapon['crafting']['upgrades'].append({
                'to_tier': clean_string(upg.get('output', '')),
                'materials': clean_materials(upg.get('materials', [])),
                'workshop': clean_string(upg.get('workshop'))
            })

        weapons.append(weapon)

    return weapons

def process_equipment(equipment_data):
    """Process and clean equipment data."""
    processed = {}

    for category, items in equipment_data.items():
        processed[category] = []
        for item in items:
            # Skip generic pages that got scraped accidentally
            if item['name'] in ['Quick Use', 'ARC', 'Raider', 'Skills']:
                continue

            processed_item = {
                'id': item['name'].lower().replace(' ', '_').replace('%27', "'"),
                'name': clean_string(item['name'].replace('%27', "'")),
                'category': category,
                'rarity': item.get('rarity'),
                'description': clean_string(item.get('description')),
                'stats': item.get('stats', {}),
                'crafting': {
                    'materials': clean_materials(item.get('crafting', {}).get('materials', [])),
                    'workshop': clean_string(item.get('crafting', {}).get('workshop'))
                }
            }
            processed[category].append(processed_item)

    return processed

def process_modifications(mods_data):
    """Process and clean modifications data."""
    mods = []

    # Filter out materials that got scraped accidentally
    material_names = ['Metal Parts', 'Plastic Parts', 'Rubber Parts', 'Wires', 'Duct Tape',
                      'Mechanical Components', 'Steel Spring', 'Mod Components']

    for mod in mods_data:
        if mod['name'] in material_names:
            continue

        processed = {
            'id': mod['name'].lower().replace(' ', '_'),
            'name': clean_string(mod['name']),
            'slot_type': clean_string(mod.get('slot_type')) or infer_slot_type(mod['name']),
            'rarity': mod.get('rarity'),
            'effects': mod.get('effects', []),
            'compatible_weapons': mod.get('compatible_weapons', []),
            'crafting': {
                'materials': clean_materials(mod.get('crafting', {}).get('materials', [])),
                'workshop': clean_string(mod.get('crafting', {}).get('workshop'))
            }
        }
        mods.append(processed)

    return mods

def infer_slot_type(name):
    """Infer modification slot type from name."""
    name_lower = name.lower()
    if 'compensator' in name_lower or 'muzzle' in name_lower or 'silencer' in name_lower or 'choke' in name_lower or 'barrel' in name_lower:
        return 'Muzzle'
    elif 'grip' in name_lower:
        return 'Underbarrel'
    elif 'mag' in name_lower:
        if 'light' in name_lower:
            return 'Light-Mag'
        elif 'medium' in name_lower:
            return 'Medium-Mag'
        elif 'shotgun' in name_lower:
            return 'Shotgun-Mag'
        return 'Magazine'
    elif 'stock' in name_lower:
        return 'Stock'
    elif 'splitter' in name_lower or 'kinetic' in name_lower:
        return 'Tech-Mod'
    return 'Unknown'

def process_materials(materials_data):
    """Process and clean materials data."""
    materials = []
    for mat in materials_data.get('materials', []):
        materials.append({
            'id': mat['id'].lower(),
            'name': clean_string(mat['name']),
            'rarity': mat.get('rarity'),
            'weight': mat.get('weight'),
            'stack_size': mat.get('stack_size'),
            'crafting': {
                'materials': clean_materials(mat.get('crafting', {}).get('materials', [])),
                'workshop': clean_string(mat.get('crafting', {}).get('workshop')),
                'output_quantity': mat.get('crafting', {}).get('output_quantity', 1)
            }
        })

    ammo = []
    for a in materials_data.get('ammo', []):
        ammo.append({
            'id': a['id'].lower(),
            'name': clean_string(a['name']),
            'weight': a.get('weight'),
            'stack_size': a.get('stack_size'),
            'crafting': {
                'materials': clean_materials(a.get('crafting', {}).get('materials', [])),
                'workshop': clean_string(a.get('crafting', {}).get('workshop')),
                'output_quantity': a.get('crafting', {}).get('output_quantity', 1)
            }
        })

    return {'materials': materials, 'ammo': ammo}

def main():
    print("=" * 60)
    print("Consolidating Arc Raiders Data")
    print("=" * 60)

    # Load all data
    print("\nLoading scraped data...")
    weapons_data = load_json('weapons_data.json')
    equipment_data = load_json('equipment_data.json')
    mods_data = load_json('modifications_data.json')
    materials_data = load_json('materials_data.json')

    # Process data
    print("Processing weapons...")
    weapons = process_weapons(weapons_data)

    print("Processing equipment...")
    equipment = process_equipment(equipment_data)

    print("Processing modifications...")
    modifications = process_modifications(mods_data)

    print("Processing materials...")
    materials = process_materials(materials_data)

    # Create unified data structure
    game_data = {
        'version': '1.0.0',
        'last_updated': '2025-12-02',
        'weapons': weapons,
        'equipment': {
            'augments': equipment.get('augments', []),
            'shields': equipment.get('shields', []),
            'healing': equipment.get('healing', []),
            'quick_use': equipment.get('quick_use', []),
            'grenades': equipment.get('grenades', []),
            'traps': equipment.get('traps', [])
        },
        'modifications': modifications,
        'materials': materials['materials'],
        'ammo': materials['ammo']
    }

    # Save consolidated data
    output_file = '../data/game_data.json'
    os.makedirs('../data', exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(game_data, f, indent=2, ensure_ascii=False)

    print(f"\nSaved consolidated data to {output_file}")

    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Weapons: {len(weapons)}")
    print(f"Augments: {len(equipment.get('augments', []))}")
    print(f"Shields: {len(equipment.get('shields', []))}")
    print(f"Healing: {len(equipment.get('healing', []))}")
    print(f"Quick Use: {len(equipment.get('quick_use', []))}")
    print(f"Grenades: {len(equipment.get('grenades', []))}")
    print(f"Traps: {len(equipment.get('traps', []))}")
    print(f"Modifications: {len(modifications)}")
    print(f"Materials: {len(materials['materials'])}")
    print(f"Ammo Types: {len(materials['ammo'])}")

if __name__ == '__main__':
    main()
