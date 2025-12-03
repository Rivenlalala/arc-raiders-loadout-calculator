#!/usr/bin/env python3
"""
Scraper for Arc Raiders weapon modifications from the wiki.
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin

BASE_URL = "https://arcraiders.wiki"
MODS_URL = f"{BASE_URL}/wiki/Weapon_Modifications"

def get_soup(url):
    """Fetch a URL and return BeautifulSoup object."""
    print(f"Fetching: {url}")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    time.sleep(0.5)
    return BeautifulSoup(response.text, 'html.parser')

def extract_mod_links(soup):
    """Extract all modification links from the mods page."""
    mods = []
    content = soup.find('div', {'class': 'mw-parser-output'})
    if not content:
        content = soup

    # Exclude materials and other non-mod items
    exclude_items = [
        'Metal_Parts', 'Plastic_Parts', 'Rubber_Parts', 'Wires', 'Duct_Tape',
        'Steel_Spring', 'Mechanical_Components', 'Mod_Components', 'Weapon_Modifications'
    ]

    # Look for links in tables
    for table in content.find_all('table'):
        for link in table.find_all('a'):
            href = link.get('href', '')
            if (href and
                href.startswith('/wiki/') and
                not any(x in href for x in [':', 'Category', 'File', 'Special']) and
                not any(x in href for x in exclude_items)):

                mod_name = href.replace('/wiki/', '').replace('_', ' ')
                if mod_name and len(mod_name) > 1:
                    full_url = urljoin(BASE_URL, href)
                    mods.append({
                        'name': mod_name,
                        'url': full_url
                    })

    # Remove duplicates
    seen = set()
    unique_mods = []
    for m in mods:
        if m['url'] not in seen:
            seen.add(m['url'])
            unique_mods.append(m)

    return unique_mods

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

def extract_mod_data(url, mod_name):
    """Extract modification data from detail page."""
    try:
        soup = get_soup(url)
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return None

    mod_data = {
        'name': mod_name,
        'url': url,
        'slot_type': None,
        'rarity': None,
        'effects': [],
        'stats': {},  # New: exact stat percentages
        'compatible_weapons': [],
        'crafting': {
            'materials': [],
            'workshop': None
        }
    }

    content = soup.find('div', {'class': 'mw-parser-output'})
    if not content:
        return mod_data

    # Extract from infobox
    infobox = content.find('table', {'class': 'infobox'})
    if infobox:
        # Get rarity from data-tag rows
        for row in infobox.find_all('tr', {'class': 'data-tag'}):
            text = row.get_text(strip=True)
            if text in ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']:
                mod_data['rarity'] = text

        # Get effects from quote
        quote_row = infobox.find('tr', {'class': lambda x: x and 'quote' in x})
        if quote_row:
            for br in quote_row.find_all('br'):
                br.replace_with('\n')
            effects = quote_row.get_text(strip=True).split('\n')
            mod_data['effects'] = [e.strip() for e in effects if e.strip()]

        # Get exact stats from data-fun rows (data-fun1, data-fun2, etc.)
        stat_effects = []
        for row in infobox.find_all('tr', {'class': lambda x: x and 'data-fun' in str(x)}):
            stat_text = row.get_text(strip=True)
            if stat_text and (('%' in stat_text) or ('+' in stat_text) or ('-' in stat_text) or ('Increased' in stat_text) or ('Reduced' in stat_text)):
                stat_effects.append(stat_text)
        if stat_effects:
            mod_data['stats']['effects'] = stat_effects  # List of all stat effects

        # Get compatible weapons from data-warning row
        warning_row = infobox.find('tr', {'class': lambda x: x and 'data-warning' in str(x)})
        if warning_row:
            for link in warning_row.find_all('a'):
                href = link.get('href', '')
                if href.startswith('/wiki/') and ':' not in href:
                    weapon_name = link.get_text(strip=True)
                    if weapon_name and weapon_name not in mod_data['compatible_weapons']:
                        mod_data['compatible_weapons'].append(weapon_name)

    # Get slot type from the opening paragraph (e.g., "Common Shotgun Muzzle Weapon Modification")
    first_p = content.find('p')
    if first_p:
        p_text = first_p.get_text(strip=True)
        # Extract slot type from patterns - map wiki text to slot names used in weapon data
        slot_mapping = [
            ('Shotgun Muzzle', 'Shotgun-Muzzle'),
            ('Shotgun Magazine', 'Shotgun-Mag'),
            ('Light Magazine', 'Light-Mag'),
            ('Medium Magazine', 'Medium-Mag'),
            ('Tech Mod', 'Tech-Mod'),
            ('Muzzle', 'Muzzle'),
            ('Underbarrel', 'Underbarrel'),
            ('Stock', 'Stock'),
        ]
        for wiki_text, slot_name in slot_mapping:
            if wiki_text in p_text:
                mod_data['slot_type'] = slot_name
                break

    # Look for compatible weapons section
    for h3 in content.find_all('h3'):
        if 'compatible' in h3.get_text().lower():
            parent = h3.find_parent('div')
            if parent:
                next_el = parent.find_next_sibling()
                if next_el:
                    # Get weapon links
                    for link in next_el.find_all('a'):
                        href = link.get('href', '')
                        if href.startswith('/wiki/') and not ':' in href:
                            weapon_name = href.replace('/wiki/', '').replace('_', ' ')
                            if weapon_name and weapon_name not in mod_data['compatible_weapons']:
                                mod_data['compatible_weapons'].append(weapon_name)

    # Find crafting section
    craft_section = content.find('h3', {'id': 'Required_Materials_to_Craft'})
    if not craft_section:
        for h3 in content.find_all('h3'):
            if 'craft' in h3.get_text().lower():
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
                            for cell in cells:
                                text = cell.get_text()
                                if 'Gunsmith' in text:
                                    workshop = text.strip()
                                    break

                            if materials:
                                mod_data['crafting'] = {
                                    'materials': materials,
                                    'workshop': workshop
                                }
                                break

    return mod_data

def main():
    print("=" * 60)
    print("Arc Raiders Modifications Scraper")
    print("=" * 60)

    # Get the mods list page
    print("\n[1] Fetching modifications list...")
    soup = get_soup(MODS_URL)

    # Extract all mod links
    print("\n[2] Extracting modification links...")
    mods = extract_mod_links(soup)
    print(f"Found {len(mods)} potential modifications")

    # Fetch each mod's detail page
    print("\n[3] Fetching modification details...")
    all_mods = []

    for mod in mods:
        data = extract_mod_data(mod['url'], mod['name'])
        if data:
            all_mods.append(data)
            mats = len(data['crafting']['materials'])
            weapons = len(data['compatible_weapons'])
            print(f"  ✓ {mod['name']}: {mats} materials, {weapons} compatible weapons")

    # Save to JSON
    output_file = 'modifications_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_mods, f, indent=2, ensure_ascii=False)

    print(f"\n[4] Saved {len(all_mods)} modifications to {output_file}")

    # Group by slot type for summary
    print("\n" + "=" * 60)
    print("SUMMARY BY SLOT TYPE")
    print("=" * 60)

    slot_counts = {}
    for mod in all_mods:
        slot = mod['slot_type'] or 'Unknown'
        slot_counts[slot] = slot_counts.get(slot, 0) + 1

    for slot, count in sorted(slot_counts.items()):
        print(f"  {slot}: {count} mods")

if __name__ == '__main__':
    main()
