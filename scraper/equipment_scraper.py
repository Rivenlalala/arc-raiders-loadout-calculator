#!/usr/bin/env python3
"""
Scraper for Arc Raiders equipment data from the wiki.
Extracts augments, shields, healing, quick use, grenades, and traps.
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin

BASE_URL = "https://arcraiders.wiki"

# Equipment category pages
# Note: 'healing' removed as quick_use now includes healing items
EQUIPMENT_PAGES = {
    'augments': f"{BASE_URL}/wiki/Augments",
    'shields': f"{BASE_URL}/wiki/Shields",
    'quick_use': f"{BASE_URL}/wiki/Quick_Use",
    'grenades': f"{BASE_URL}/wiki/Grenades",
    'traps': f"{BASE_URL}/wiki/Traps",
}

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

def extract_item_links(soup, exclude_terms=None):
    """Extract all item links from a category page."""
    if exclude_terms is None:
        exclude_terms = []

    items = []
    content = soup.find('div', {'class': 'mw-parser-output'})
    if not content:
        content = soup

    # Look for links in tables and content
    for link in content.find_all('a'):
        href = link.get('href', '')
        title = link.get('title', '') or link.get_text(strip=True)

        # Filter for item pages
        if (href and
            href.startswith('/wiki/') and
            not any(x in href for x in [':', 'Category', 'File', 'Special'])):

            item_name = href.replace('/wiki/', '').replace('_', ' ')
            # Exact match exclusion (compare page name, not substring)
            page_name = href.replace('/wiki/', '').replace('_', ' ')
            if any(page_name.lower() == x.lower() for x in exclude_terms):
                continue
            if item_name and len(item_name) > 1:
                full_url = urljoin(BASE_URL, href)
                items.append({
                    'name': item_name,
                    'url': full_url,
                    'title': title
                })

    # Remove duplicates
    seen = set()
    unique_items = []
    for item in items:
        if item['url'] not in seen:
            seen.add(item['url'])
            unique_items.append(item)

    return unique_items

def parse_recipe_cell(cell):
    """Parse a recipe cell and extract materials with quantities."""
    materials = []

    # Replace <br> with newlines
    for br in cell.find_all('br'):
        br.replace_with('\n')

    text = cell.get_text()
    lines = text.strip().split('\n')

    for line in lines:
        line = line.strip()
        match = re.match(r'(\d+)[x×]\s*(.+)', line)
        if match:
            quantity = int(match.group(1))
            material = match.group(2).strip()
            materials.append({
                'material': material,
                'quantity': quantity
            })

    return materials


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
        workshop = re.sub(r'[\w\s]+Blueprint\s*required', '', full_text).strip()

    return workshop, blueprint_required

def extract_item_data(url, item_name, category):
    """Extract crafting data from an item's detail page."""
    try:
        soup = get_soup(url)
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return None

    item_data = {
        'name': item_name,
        'url': url,
        'category': category,
        'rarity': None,
        'description': None,
        'special_effect': None,  # New: data-warning text for augments
        'is_healing': False,  # Detected from infobox icon or data-healing row
        'stats': {},
        'crafting': {
            'materials': [],
            'workshop': None,
            'blueprint_required': False,
            'output': None
        }
    }

    content = soup.find('div', {'class': 'mw-parser-output'})
    if not content:
        return item_data

    # Extract from infobox
    infobox = content.find('table', {'class': 'infobox'})
    if infobox:
        # Detect if this is a healing item
        # Check 1: Look for ItemCategory_Regenerative.png icon
        for img in infobox.find_all('img'):
            src = img.get('src', '')
            if 'ItemCategory_Regenerative' in src:
                item_data['is_healing'] = True
                break
        # Check 2: Look for data-healing row in infobox
        if not item_data['is_healing']:
            healing_row = infobox.find('tr', {'class': lambda x: x and 'data-healing' in str(x)})
            if healing_row:
                item_data['is_healing'] = True

        # Get rarity
        for row in infobox.find_all('tr', {'class': 'data-tag'}):
            text = row.get_text(strip=True)
            if text in ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']:
                item_data['rarity'] = text

        # Get description/quote
        quote_row = infobox.find('tr', {'class': lambda x: x and 'quote' in x})
        if quote_row:
            item_data['description'] = quote_row.get_text(strip=True)

        # Get special effect from data-warning rows (used for augment passive abilities)
        warning_row = infobox.find('tr', {'class': lambda x: x and 'data-warning' in x})
        if warning_row:
            item_data['special_effect'] = warning_row.get_text(strip=True)

        # Get stats from infobox rows
        for row in infobox.find_all('tr', {'class': 'infobox-data'}):
            header = row.find('th')
            value = row.find('td')
            if header and value:
                stat_name = header.get_text(strip=True)
                stat_value = value.get_text(strip=True)
                item_data['stats'][stat_name] = stat_value

        # Extract augment slot stats from visual diagram (aug-pm class)
        aug_pm = infobox.find('div', {'class': 'aug-pm'})
        if aug_pm:
            slot_mapping = {
                'regular': 'Backpack Slots',
                'safepocket': 'Safe Pocket Slots',
                'quick-use': 'Quick Use Slots',
                'weapon': 'Weapon Slots',
                'grenade': 'Grenade Use Slots',
                'utility': 'Deployable Utility Slots',
                'trinket': 'Trinket Slots',
            }
            # Count slots that use div count instead of amount class
            count_slots = {'weapon': 0, 'grenade': 0, 'utility': 0, 'trinket': 0}

            for slot_div in aug_pm.find_all('div'):
                classes = slot_div.get('class', [])
                class_str = ' '.join(classes)

                # Check for amount in class (e.g., aug-pm__amount--18)
                amount = None
                for c in classes:
                    if 'aug-pm__amount--' in c:
                        amount = c.split('--')[1]
                        break

                if amount is not None:
                    # Has explicit amount - use it if > 0
                    if amount != '0':
                        for key, stat_name in slot_mapping.items():
                            if f'aug-pm__item-{key}' in class_str:
                                item_data['stats'][stat_name] = amount
                                break
                else:
                    # No amount class - count divs for these slot types
                    for key in count_slots:
                        if f'aug-pm__item-{key}' in class_str:
                            count_slots[key] += 1
                            break

            # Add counted slots to stats
            for key, count in count_slots.items():
                if count > 0:
                    item_data['stats'][slot_mapping[key]] = str(count)

    def find_table_after_heading(heading):
        """Find the wikitable in the section following a heading."""
        if not heading:
            return None
        # The heading is inside a div.mw-heading, and the table is in the next section sibling
        parent_div = heading.find_parent('div', {'class': 'mw-heading'})
        if parent_div:
            next_section = parent_div.find_next_sibling('section')
            if next_section:
                return next_section.find('table', {'class': 'wikitable'})
        # Fallback: find next wikitable
        return heading.find_next('table', {'class': 'wikitable'})

    # Find crafting section - try multiple heading patterns
    craft_heading = content.find('h3', {'id': 'Required_Materials_to_Craft'})
    if not craft_heading:
        craft_heading = content.find('h2', {'id': 'Required_Materials_to_Craft'})
    if not craft_heading:
        craft_heading = content.find('h2', {'id': 'Crafting'})

    craft_table = find_table_after_heading(craft_heading)
    if craft_table:
        rows = craft_table.find_all('tr')
        for row in rows[1:]:
            cells = row.find_all('td')
            if cells:
                materials = parse_recipe_cell(cells[0])
                # Only parse blueprint for augments
                if category == 'augments' and len(cells) > 2:
                    workshop, blueprint_required = parse_requirements_cell(cells[2])
                else:
                    workshop = cells[2].get_text(strip=True) if len(cells) > 2 else None
                    blueprint_required = False
                output = cells[-1].get_text(strip=True) if len(cells) > 1 else None

                if materials:
                    item_data['crafting'] = {
                        'materials': materials,
                        'workshop': workshop,
                        'blueprint_required': blueprint_required,
                        'output': output
                    }
                    break

    return item_data

def scrape_category(category_name, url):
    """Scrape all items from a category."""
    print(f"\n{'='*60}")
    print(f"Scraping: {category_name.upper()}")
    print(f"{'='*60}")

    try:
        soup = get_soup(url)
    except Exception as e:
        print(f"Error fetching category page: {e}")
        return []

    # Exclude general navigation items and non-equipment pages
    exclude = ['Equipment', 'Augments', 'Shields', 'Healing', 'Quick Use', 'Quick_Use',
               'Grenades', 'Traps', 'Weapons', 'Skills', 'Raider', 'ARC', category_name]

    # Category-specific exclusions (items that appear on wrong category pages)
    if category_name != 'augments':
        # Exclude augments that may be linked on other pages
        exclude.extend([
            'Tactical Mk. 3 (Defensive)', 'Tactical Mk. 3 (Healing)',
            'Combat Mk. 3 (Aggressive)', 'Combat Mk. 3 (Flanking)',
            'Looting Mk. 3 (Cautious)', 'Looting Mk. 3 (Survivor)',
            'Integrated Binoculars', 'Integrated Shield Recharger',
        ])

    if category_name in ['quick_use', 'grenades']:
        # Exclude materials that may be linked on these pages
        exclude.extend(['ARC Powercell', 'Crude Explosives', 'Synthesized Fuel', 'Fabric'])

    items = extract_item_links(soup, exclude)
    print(f"Found {len(items)} potential items")

    all_items = []
    for item in items:
        data = extract_item_data(item['url'], item['name'], category_name)
        if data:
            mats = len(data['crafting']['materials'])
            all_items.append(data)
            print(f"  ✓ {item['name']}: {mats} materials")

    return all_items

def main():
    print("=" * 60)
    print("Arc Raiders Equipment Scraper")
    print("=" * 60)

    all_equipment = {}

    for category, url in EQUIPMENT_PAGES.items():
        items = scrape_category(category, url)
        all_equipment[category] = items

    # Separate healing items from quick_use into dedicated healing category
    if 'quick_use' in all_equipment:
        healing_items = []
        non_healing_items = []
        for item in all_equipment['quick_use']:
            if item.get('is_healing', False):
                # Update category to 'healing'
                item['category'] = 'healing'
                healing_items.append(item)
            else:
                non_healing_items.append(item)

        all_equipment['quick_use'] = non_healing_items
        all_equipment['healing'] = healing_items
        print(f"\nMoved {len(healing_items)} healing items from quick_use to healing category")

    # Remove is_healing field from all items (no longer needed in output)
    for category, items in all_equipment.items():
        for item in items:
            if 'is_healing' in item:
                del item['is_healing']

    # Save to JSON
    output_file = 'equipment_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_equipment, f, indent=2, ensure_ascii=False)

    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")

    total = 0
    for category, items in all_equipment.items():
        print(f"{category}: {len(items)} items")
        total += len(items)

    print(f"\nTotal: {total} items saved to {output_file}")

if __name__ == '__main__':
    main()
