#!/usr/bin/env python3
"""
Scraper for Arc Raiders weapon data from the wiki.
Extracts all weapons and their crafting/upgrade recipes.
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin

BASE_URL = "https://arcraiders.wiki"
WEAPONS_URL = f"{BASE_URL}/wiki/Weapons"

def get_soup(url):
    """Fetch a URL and return BeautifulSoup object."""
    print(f"Fetching: {url}")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    time.sleep(0.5)  # Be polite to the server
    return BeautifulSoup(response.text, 'html.parser')

def extract_weapon_links(soup):
    """Extract all weapon links from the weapons page."""
    weapons = []

    # Find all links in tables (weapons are listed in tables)
    content = soup.find('div', {'class': 'mw-parser-output'})
    if not content:
        content = soup

    tables = content.find_all('table')

    for table in tables:
        rows = table.find_all('tr')
        for row in rows:
            links = row.find_all('a')
            for link in links:
                href = link.get('href', '')

                # Filter for weapon pages
                if href and href.startswith('/wiki/') and not any(x in href for x in [':', 'Category', 'File', 'Special', 'Weapons', 'Equipment']):
                    weapon_name = href.replace('/wiki/', '').replace('_', ' ')
                    if weapon_name:
                        full_url = urljoin(BASE_URL, href)
                        weapons.append({
                            'name': weapon_name,
                            'url': full_url
                        })

    # Remove duplicates
    seen = set()
    unique_weapons = []
    for w in weapons:
        if w['url'] not in seen:
            seen.add(w['url'])
            unique_weapons.append(w)

    return unique_weapons

def parse_requirements_cell(cell):
    """Parse requirements cell, extracting workshop and blueprint_required flag."""
    if not cell:
        return None, False

    # Check if blueprint is required (look for Blueprint link or text)
    blueprint_required = False
    blueprint_link = cell.find('a')
    if blueprint_link:
        link_text = blueprint_link.get_text(strip=True)
        if 'Blueprint' in link_text:
            blueprint_required = True

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
        # Remove blueprint-related text
        workshop = re.sub(r'[\w\s]+Blueprint\s*required', '', full_text).strip()

    return workshop, blueprint_required


def parse_recipe_cell(cell):
    """Parse a recipe cell and extract materials with quantities."""
    materials = []

    # Get text content and split by <br> tags
    # First, replace <br> with newlines in the HTML
    for br in cell.find_all('br'):
        br.replace_with('\n')

    text = cell.get_text()
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

def extract_weapon_data(url, weapon_name):
    """Extract crafting and upgrade data from a weapon's detail page."""
    try:
        soup = get_soup(url)
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

    weapon_data = {
        'name': weapon_name,
        'url': url,
        'category': None,
        'rarity': None,
        'ammo_type': None,
        'modification_slots': [],
        'base_craft': {
            'materials': [],
            'workshop': None,
            'blueprint_required': None,
            'output': None
        },
        'upgrades': [],
        'repair': []
    }

    content = soup.find('div', {'class': 'mw-parser-output'})
    if not content:
        return weapon_data

    # Known weapon categories
    weapon_categories = ['Assault Rifle', 'Pistol', 'Shotgun', 'SMG', 'Sniper Rifle',
                         'Machine Gun', 'DMR', 'Launcher', 'Energy Weapon',
                         'Battle Rifle', 'Hand Cannon', 'LMG', 'Special', 'Specials']

    # Extract from infobox
    infobox = content.find('table', {'class': 'infobox'})
    if infobox:
        # Get category and rarity from data-tag rows
        for row in infobox.find_all('tr', {'class': 'data-tag'}):
            text = row.get_text(strip=True)
            # Check if this is a weapon category
            if text in weapon_categories:
                weapon_data['category'] = text
            # Check if this is a rarity
            elif text in ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']:
                weapon_data['rarity'] = text

        # Get ammo type
        ammo_row = infobox.find('tr', {'class': 'data-ammo'})
        if ammo_row:
            ammo_td = ammo_row.find('td')
            if ammo_td:
                weapon_data['ammo_type'] = ammo_td.get_text(strip=True)

        # Get modification slots from the mods row
        mods_row = infobox.find('tr', {'class': 'data-mods'})
        if mods_row:
            mod_images = mods_row.find_all('img')
            for img in mod_images:
                alt = img.get('alt', '')
                if alt:
                    weapon_data['modification_slots'].append(alt)

    # Find sections by h2 headings (new wiki structure)
    craft_heading = content.find('h2', {'id': 'Crafting'})
    upgrade_heading = content.find('h2', {'id': 'Upgrading'})
    repair_heading = content.find('h2', {'id': 'Repairing'})

    def find_table_after_heading(heading):
        """Find the wikitable in the section following a heading."""
        if not heading:
            return None
        # The h2 is inside a div.mw-heading, and the table is in the next section sibling
        parent_div = heading.find_parent('div', {'class': 'mw-heading'})
        if parent_div:
            next_section = parent_div.find_next_sibling('section')
            if next_section:
                return next_section.find('table', {'class': 'wikitable'})
        # Fallback: find next wikitable sibling
        return heading.find_next('table', {'class': 'wikitable'})

    # Parse crafting table
    craft_table = find_table_after_heading(craft_heading)
    if craft_table:
        rows = craft_table.find_all('tr')
        for row in rows[1:]:  # Skip header
            cells = row.find_all('td')
            if len(cells) >= 3:
                materials = parse_recipe_cell(cells[0])
                workshop, blueprint = parse_requirements_cell(cells[2])
                output = cells[4].get_text(strip=True) if len(cells) > 4 else None

                weapon_data['base_craft'] = {
                    'materials': materials,
                    'workshop': workshop,
                    'blueprint_required': blueprint,
                    'output': output
                }

    # Parse upgrade table
    upgrade_table = find_table_after_heading(upgrade_heading)
    if upgrade_table:
        rows = upgrade_table.find_all('tr')
        for row in rows[1:]:  # Skip header
            cells = row.find_all('td')
            if len(cells) >= 5:
                recipe_cell = cells[0]
                materials = parse_recipe_cell(recipe_cell)
                workshop = cells[2].get_text(strip=True)
                output = cells[4].get_text(strip=True)
                perks = cells[5].get_text(strip=True) if len(cells) > 5 else None

                # Filter out the weapon itself from materials (e.g., "Kettle I" for upgrading Kettle)
                # Only keep actual crafting materials, not the weapon being upgraded
                filtered_materials = [
                    m for m in materials
                    if not re.match(rf'^{re.escape(weapon_name)}\s*(I+|IV|V)?$', m['material'])
                ]

                # Determine tier from output
                tier_match = re.search(r'(I+|IV|V)$', output)
                tier = tier_match.group(1) if tier_match else None

                weapon_data['upgrades'].append({
                    'from_tier': output.replace(weapon_name, '').strip() if weapon_name in output else None,
                    'to_tier': tier,
                    'output': output,
                    'materials': filtered_materials,
                    'workshop': workshop,
                    'perks': perks
                })

    # Parse repair table
    repair_table = find_table_after_heading(repair_heading)
    if repair_table:
        rows = repair_table.find_all('tr')
        for row in rows[1:]:  # Skip header
            cells = row.find_all('td')
            if len(cells) >= 2:
                # First cell might be tier indicator
                repair_cost_cell = cells[1] if len(cells) > 2 else cells[0]
                durability_cell = cells[2] if len(cells) > 2 else cells[1]

                materials = parse_recipe_cell(repair_cost_cell)
                durability = durability_cell.get_text(strip=True)

                if materials:
                    weapon_data['repair'].append({
                        'materials': materials,
                        'durability_restored': durability
                    })

    return weapon_data

def main():
    print("=" * 60)
    print("Arc Raiders Weapon Scraper")
    print("=" * 60)

    # Step 1: Get the weapons list page
    print("\n[1] Fetching weapons list...")
    soup = get_soup(WEAPONS_URL)

    # Step 2: Extract all weapon links
    print("\n[2] Extracting weapon links...")
    weapons = extract_weapon_links(soup)
    print(f"Found {len(weapons)} potential weapon pages")

    for w in weapons:
        print(f"  - {w['name']}")

    # Step 3: Fetch each weapon's detail page
    print("\n[3] Fetching weapon details...")
    all_weapon_data = []

    for weapon in weapons:
        data = extract_weapon_data(weapon['url'], weapon['name'])
        if data:
            all_weapon_data.append(data)
            base_mats = len(data['base_craft']['materials'])
            upgrades = len(data['upgrades'])
            mods = len(data['modification_slots'])
            print(f"  ✓ {weapon['name']}: {base_mats} base mats, {upgrades} upgrades, {mods} mod slots")

    # Step 4: Save to JSON
    output_file = 'weapons_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_weapon_data, f, indent=2, ensure_ascii=False)

    print(f"\n[4] Saved {len(all_weapon_data)} weapons to {output_file}")

    # Print detailed summary for verification
    print("\n" + "=" * 60)
    print("DETAILED SUMMARY")
    print("=" * 60)

    for weapon in all_weapon_data[:3]:  # Print first 3 for verification
        print(f"\n{weapon['name']}:")
        print(f"  Category: {weapon['category']}")
        print(f"  Ammo: {weapon['ammo_type']}")
        print(f"  Mod slots: {weapon['modification_slots']}")
        print(f"  Base craft: {weapon['base_craft']}")
        if weapon['upgrades']:
            print(f"  Upgrades ({len(weapon['upgrades'])}):")
            for upg in weapon['upgrades']:
                print(f"    {upg['output']}: {upg['materials']}")

if __name__ == '__main__':
    main()
