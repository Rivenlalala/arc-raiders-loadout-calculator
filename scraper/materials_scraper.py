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

    # Electrical components
    "Electrical_Components", "Advanced_Electrical_Components",
    "Processor", "Sensors", "Speaker_Component",

    # Refined materials (craftable)
    "Mechanical_Components", "Advanced_Mechanical_Components", "Mod_Components",
    "Explosive_Compound", "Crude_Explosives",

    # Gun parts
    "Simple_Gun_Parts", "Light_Gun_Parts", "Medium_Gun_Parts", "Heavy_Gun_Parts", "Complex_Gun_Parts",

    # ARC materials
    "ARC_Alloy", "ARC_Circuitry", "ARC_Motion_Core", "ARC_Powercell", "Advanced_ARC_Powercell",

    # Special materials
    "Magnetic_Accelerator", "Steel_Spring", "Magnet", "Canister", "Voltage_Converter", "Power_Rod",
    "Exodus_Modules", "Queen_Reactor", "Matriarch_Reactor",

    # Medical/consumable ingredients
    "Antiseptic", "Syringe", "Durable_Cloth", "Great_Mullein",
    "Empty_Wine_Bottle", "Air_Freshener",
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

def parse_workshop_cell(cell):
    """Parse workshop/requirements cell, extracting just the workshop name."""
    if not cell:
        return None

    # Workshop is the text before the <br> or <a> tag
    cell_text = ''
    for child in cell.children:
        if child.name == 'br' or child.name == 'a':
            break
        if hasattr(child, 'get_text'):
            cell_text += child.get_text(strip=True)
        else:
            cell_text += str(child).strip()

    workshop = cell_text.strip() if cell_text.strip() else None
    if not workshop:
        # Fallback: get full text and clean it
        full_text = cell.get_text(strip=True)
        workshop = re.sub(r'[\w\s]+Blueprint\s*required', '', full_text).strip()

    return workshop


def parse_recipe_cell(cell):
    """Parse a recipe cell and extract materials with quantities."""
    materials = []

    # Replace <br> tags with newlines
    cell_copy = BeautifulSoup(str(cell), 'html.parser')
    for br in cell_copy.find_all('br'):
        br.replace_with('\n')

    text = cell_copy.get_text()
    lines = text.strip().split('\n')

    for line in lines:
        line = line.strip()
        # Pattern: quantity followed by 'x' or '×' and material name
        match = re.match(r'(\d+)[x×]\s*(.+)', line)
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
        'crafting': {
            'materials': [],
            'workshop': None,
            'output_quantity': 1
        }
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
        quote_row = infobox.find('tr', {'class': lambda x: x and 'quote' in str(x)})
        if quote_row:
            material_data['description'] = quote_row.get_text(strip=True)

    def find_table_after_heading(heading):
        """Find the wikitable in the section following a heading."""
        if not heading:
            return None
        parent_div = heading.find_parent('div', {'class': 'mw-heading'})
        if parent_div:
            next_section = parent_div.find_next_sibling('section')
            if next_section:
                return next_section.find('table', {'class': 'wikitable'})
        return heading.find_next('table', {'class': 'wikitable'})

    # Find crafting recipe - prioritize "Required Materials to Craft" over "Crafting"
    craft_heading = None
    # Try h2#Required_Materials_to_Craft first (actual craft recipe)
    craft_heading = content.find('h2', {'id': 'Required_Materials_to_Craft'})
    if not craft_heading:
        craft_heading = content.find('h3', {'id': 'Required_Materials_to_Craft'})
    # Then try h2#Crafting (but this might be "uses" table)
    if not craft_heading:
        craft_heading = content.find('h2', {'id': 'Crafting'})
    # Fallback: search for heading text, prioritize "required materials"
    if not craft_heading:
        for heading in content.find_all(['h2', 'h3']):
            heading_text = heading.get_text().lower()
            if 'required materials to craft' in heading_text:
                craft_heading = heading
                break
        if not craft_heading:
            for heading in content.find_all(['h2', 'h3']):
                if heading.get_text().strip().lower() == 'crafting':
                    craft_heading = heading
                    break

    craft_table = find_table_after_heading(craft_heading)
    if craft_table:
        rows = craft_table.find_all('tr')
        for row in rows[1:]:  # Skip header
            cells = row.find_all('td')
            if len(cells) >= 5:
                # Check if output column contains this material's name
                output_text = cells[4].get_text(strip=True)
                if display_name.lower() not in output_text.lower():
                    continue  # This is a "uses" recipe, not a "craft" recipe

                materials = parse_recipe_cell(cells[0])
                workshop = parse_workshop_cell(cells[2]) if len(cells) > 2 else None

                output_qty = 1
                qty_match = re.search(r'(\d+)[x×]', output_text)
                if qty_match:
                    output_qty = int(qty_match.group(1))

                if materials:
                    material_data['crafting'] = {
                        'materials': materials,
                        'workshop': workshop,
                        'output_quantity': output_qty
                    }
                    break

    # Alternative: search all wikitables if heading approach didn't work
    if not material_data['crafting']['materials']:
        for table in content.find_all('table', {'class': 'wikitable'}):
            # Check if this table has Recipe/Workshop or Ingredients/Requirements headers
            first_row = table.find('tr')
            if first_row:
                row_text = first_row.get_text().lower()
                if ('recipe' in row_text and 'workshop' in row_text) or ('ingredients' in row_text and 'result' in row_text):
                    rows = table.find_all('tr')
                    for row in rows[1:]:
                        cells = row.find_all('td')
                        if len(cells) >= 3:
                            materials = parse_recipe_cell(cells[0])
                            workshop = cells[2].get_text(strip=True)

                            # Check if this is a recipe TO craft this material (not FROM it)
                            if len(cells) >= 5:
                                output_text = cells[4].get_text(strip=True).lower()
                                if display_name.lower() in output_text:
                                    output_qty = 1
                                    qty_match = re.search(r'(\d+)x', cells[4].get_text(strip=True))
                                    if qty_match:
                                        output_qty = int(qty_match.group(1))

                                    if materials:
                                        material_data['crafting'] = {
                                            'materials': materials,
                                            'workshop': workshop,
                                            'output_quantity': output_qty
                                        }
                                        break
                    if material_data['crafting']['materials']:
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

    # Find crafting recipe - try heading approach first
    def find_table_after_heading(heading):
        if not heading:
            return None
        parent_div = heading.find_parent('div', {'class': 'mw-heading'})
        if parent_div:
            next_section = parent_div.find_next_sibling('section')
            if next_section:
                return next_section.find('table', {'class': 'wikitable'})
        return heading.find_next('table', {'class': 'wikitable'})

    craft_heading = content.find('h2', {'id': 'Crafting'})
    if not craft_heading:
        craft_heading = content.find('h3', {'id': 'Required_Materials_to_Craft'})

    craft_table = find_table_after_heading(craft_heading)

    # Fallback: search all wikitables
    if not craft_table:
        for table in content.find_all('table', {'class': 'wikitable'}):
            first_row = table.find('tr')
            if first_row:
                row_text = first_row.get_text().lower()
                if 'recipe' in row_text or 'ingredients' in row_text:
                    craft_table = table
                    break

    if craft_table:
        rows = craft_table.find_all('tr')
        for row in rows[1:]:
            cells = row.find_all('td')
            if len(cells) >= 3:
                materials = parse_recipe_cell(cells[0])
                workshop = parse_workshop_cell(cells[2]) if len(cells) > 2 else None

                # Get output quantity from last cell
                output_qty = 1
                if len(cells) >= 5:
                    output_text = cells[4].get_text(strip=True)
                    qty_match = re.search(r'(\d+)[x×]', output_text)
                    if qty_match:
                        output_qty = int(qty_match.group(1))

                if materials:
                    ammo_data['crafting'] = {
                        'materials': materials,
                        'workshop': workshop,
                        'output_quantity': output_qty
                    }
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
            if data['crafting']['materials']:
                mats = ', '.join([f"{m['quantity']}x {m['material']}" for m in data['crafting']['materials']])
                print(f"  ✓ {data['name']}: CRAFTABLE - {mats}")
            else:
                print(f"  ✓ {data['name']}: loot only")

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

    # Print summary of craftable materials
    print("\n" + "=" * 60)
    print("CRAFTABLE MATERIALS (for resource calculator)")
    print("=" * 60)

    craftable_count = 0
    for mat in all_materials:
        if mat['crafting']['materials']:
            craftable_count += 1
            print(f"\n{mat['name']}:")
            for ingredient in mat['crafting']['materials']:
                print(f"  - {ingredient['quantity']}x {ingredient['material']}")
            print(f"  Workshop: {mat['crafting']['workshop']}")
            print(f"  Output: {mat['crafting']['output_quantity']}x")

    print(f"\n{craftable_count} craftable materials found")

if __name__ == '__main__':
    main()
