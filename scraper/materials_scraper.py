#!/usr/bin/env python3
"""
Scraper for Arc Raiders materials and ammo from the wiki.
Extracts crafting materials and their recipes (for the material hierarchy).
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin

BASE_URL = "https://arcraiders.wiki"

# Known materials and ammo to scrape
MATERIALS = [
    # Base materials (usually looted, not crafted)
    "Metal_Parts", "Plastic_Parts", "Rubber_Parts", "Wires", "Duct_Tape",
    "Chemicals", "Oil", "Fabric", "Rope", "Battery",

    # Refined materials
    "Mechanical_Components", "Advanced_Mechanical_Components", "Mod_Components",
    "Explosive_Compound", "Crude_Explosives",

    # Gun parts
    "Simple_Gun_Parts", "Light_Gun_Parts", "Medium_Gun_Parts", "Heavy_Gun_Parts", "Complex_Gun_Parts",

    # ARC materials
    "ARC_Alloy", "ARC_Circuitry", "ARC_Motion_Core", "ARC_Powercell", "Advanced_ARC_Powercell",

    # Special materials
    "Magnetic_Accelerator", "Steel_Spring", "Magnet", "Canister", "Voltage_Converter", "Power_Rod",
    "Exodus_Modules", "Queen_Reactor", "Matriarch_Reactor",
]

AMMO_TYPES = [
    "Light_Ammo", "Medium_Ammo", "Heavy_Ammo", "Shotgun_Ammo", "Energy_Clip", "Launcher_Ammo",
]

def get_soup(url):
    """Fetch a URL and return BeautifulSoup object."""
    print(f"Fetching: {url}")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        time.sleep(0.3)
        return BeautifulSoup(response.text, 'html.parser')
    except Exception as e:
        print(f"  Error: {e}")
        return None

def parse_recipe_cell(cell):
    """Parse a recipe cell and extract materials with quantities."""
    materials = []

    for br in cell.find_all('br'):
        br.replace_with('\n')

    text = cell.get_text()
    lines = text.strip().split('\n')

    for line in lines:
        line = line.strip()
        match = re.match(r'(\d+)x\s*(.+)', line)
        if match:
            quantity = int(match.group(1))
            material = match.group(2).strip()
            materials.append({
                'material': material,
                'quantity': quantity
            })

    return materials

def extract_material_data(material_name):
    """Extract material data from wiki page."""
    url = f"{BASE_URL}/wiki/{material_name}"
    soup = get_soup(url)

    if not soup:
        return None

    display_name = material_name.replace('_', ' ')

    material_data = {
        'id': material_name,
        'name': display_name,
        'url': url,
        'rarity': None,
        'weight': None,
        'stack_size': None,
        'description': None,
        'obtained_by': [],  # How to get this material
        'crafting': {       # How to craft this material (if craftable)
            'materials': [],
            'workshop': None,
            'output_quantity': 1
        },
        'used_in': []       # What this material is used to craft
    }

    content = soup.find('div', {'class': 'mw-parser-output'})
    if not content:
        return material_data

    # Extract from infobox
    infobox = content.find('table', {'class': 'infobox'})
    if infobox:
        # Get rarity
        for row in infobox.find_all('tr', {'class': 'data-tag'}):
            text = row.get_text(strip=True)
            if text in ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']:
                material_data['rarity'] = text

        # Get weight and stack size
        for row in infobox.find_all('tr', {'class': 'infobox-data'}):
            header = row.find('th')
            value = row.find('td')
            if header and value:
                header_text = header.get_text(strip=True).lower()
                value_text = value.get_text(strip=True)
                if 'weight' in header_text:
                    material_data['weight'] = value_text
                elif 'stack' in header_text:
                    material_data['stack_size'] = value_text

        # Get description
        quote_row = infobox.find('tr', {'class': lambda x: x and 'quote' in x})
        if quote_row:
            material_data['description'] = quote_row.get_text(strip=True)

    # Find how it's obtained
    obtain_section = None
    for h3 in content.find_all('h3'):
        if 'obtain' in h3.get_text().lower() or 'source' in h3.get_text().lower():
            obtain_section = h3
            break

    if obtain_section:
        parent = obtain_section.find_parent('div')
        if parent:
            next_el = parent.find_next_sibling()
            if next_el:
                for li in next_el.find_all('li'):
                    material_data['obtained_by'].append(li.get_text(strip=True))

    # Find crafting recipe (if craftable)
    craft_section = content.find('h3', {'id': 'Required_Materials_to_Craft'})
    if not craft_section:
        for h3 in content.find_all('h3'):
            if 'craft' in h3.get_text().lower() and 'required' in h3.get_text().lower():
                craft_section = h3
                break

    if craft_section:
        parent = craft_section.find_parent('div')
        if parent:
            next_element = parent.find_next_sibling()
            if next_element:
                craft_table = next_element.find('table', {'class': 'wikitable'})
                if craft_table:
                    rows = craft_table.find_all('tr')
                    for row in rows[1:]:
                        cells = row.find_all('td')
                        if cells:
                            materials = parse_recipe_cell(cells[0])
                            workshop = None
                            output_qty = 1

                            for cell in cells:
                                text = cell.get_text(strip=True)
                                if any(ws in text for ws in ['Refiner', 'Workbench', 'Station']):
                                    workshop = text
                                # Check for output quantity
                                qty_match = re.search(r'(\d+)x\s*' + display_name, text)
                                if qty_match:
                                    output_qty = int(qty_match.group(1))

                            if materials:
                                material_data['crafting'] = {
                                    'materials': materials,
                                    'workshop': workshop,
                                    'output_quantity': output_qty
                                }
                                break

    return material_data

def extract_ammo_data(ammo_name):
    """Extract ammo data from wiki page."""
    url = f"{BASE_URL}/wiki/{ammo_name}"
    soup = get_soup(url)

    if not soup:
        return None

    display_name = ammo_name.replace('_', ' ')

    ammo_data = {
        'id': ammo_name,
        'name': display_name,
        'url': url,
        'weight': None,
        'stack_size': None,
        'crafting': {
            'materials': [],
            'workshop': None,
            'output_quantity': 1
        }
    }

    content = soup.find('div', {'class': 'mw-parser-output'})
    if not content:
        return ammo_data

    # Extract from infobox
    infobox = content.find('table', {'class': 'infobox'})
    if infobox:
        for row in infobox.find_all('tr', {'class': 'infobox-data'}):
            header = row.find('th')
            value = row.find('td')
            if header and value:
                header_text = header.get_text(strip=True).lower()
                value_text = value.get_text(strip=True)
                if 'weight' in header_text:
                    ammo_data['weight'] = value_text
                elif 'stack' in header_text:
                    ammo_data['stack_size'] = value_text

    # Find crafting recipe
    for table in content.find_all('table', {'class': 'wikitable'}):
        table_text = table.get_text().lower()
        if 'recipe' in table_text or 'workshop' in table_text:
            rows = table.find_all('tr')
            for row in rows[1:]:
                cells = row.find_all('td')
                if cells:
                    materials = parse_recipe_cell(cells[0])
                    workshop = None
                    output_qty = 1

                    for cell in cells:
                        text = cell.get_text(strip=True)
                        if 'Workbench' in text:
                            workshop = text
                        # Check for output quantity
                        qty_match = re.search(r'(\d+)x', text)
                        if qty_match and display_name.lower() in text.lower():
                            output_qty = int(qty_match.group(1))

                    # Get output quantity from last cell
                    last_cell = cells[-1].get_text(strip=True)
                    qty_match = re.search(r'(\d+)x', last_cell)
                    if qty_match:
                        output_qty = int(qty_match.group(1))

                    if materials:
                        ammo_data['crafting'] = {
                            'materials': materials,
                            'workshop': workshop,
                            'output_quantity': output_qty
                        }
                        break
            if ammo_data['crafting']['materials']:
                break

    return ammo_data

def main():
    print("=" * 60)
    print("Arc Raiders Materials & Ammo Scraper")
    print("=" * 60)

    # Scrape materials
    print("\n[1] Scraping materials...")
    all_materials = []
    for material in MATERIALS:
        data = extract_material_data(material)
        if data:
            all_materials.append(data)
            craftable = "craftable" if data['crafting']['materials'] else "loot only"
            print(f"  ✓ {data['name']}: {craftable}")

    # Scrape ammo
    print("\n[2] Scraping ammo types...")
    all_ammo = []
    for ammo in AMMO_TYPES:
        data = extract_ammo_data(ammo)
        if data:
            all_ammo.append(data)
            mats = len(data['crafting']['materials'])
            qty = data['crafting']['output_quantity']
            print(f"  ✓ {data['name']}: {mats} materials, produces {qty}x")

    # Save to JSON
    output_data = {
        'materials': all_materials,
        'ammo': all_ammo
    }

    output_file = 'materials_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"\n[3] Saved {len(all_materials)} materials and {len(all_ammo)} ammo types to {output_file}")

    # Print summary
    print("\n" + "=" * 60)
    print("CRAFTABLE MATERIALS (for resource calculator)")
    print("=" * 60)
    for mat in all_materials:
        if mat['crafting']['materials']:
            print(f"\n{mat['name']}:")
            for ingredient in mat['crafting']['materials']:
                print(f"  - {ingredient['quantity']}x {ingredient['material']}")
            print(f"  Workshop: {mat['crafting']['workshop']}")

if __name__ == '__main__':
    main()
