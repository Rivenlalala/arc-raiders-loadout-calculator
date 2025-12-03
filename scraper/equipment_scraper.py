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
EQUIPMENT_PAGES = {
    'augments': f"{BASE_URL}/wiki/Augments",
    'shields': f"{BASE_URL}/wiki/Shields",
    'healing': f"{BASE_URL}/wiki/Healing",
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
            not any(x in href for x in [':', 'Category', 'File', 'Special']) and
            not any(x.lower() in href.lower() for x in exclude_terms)):

            item_name = href.replace('/wiki/', '').replace('_', ' ')
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
        match = re.match(r'(\d+)x\s*(.+)', line)
        if match:
            quantity = int(match.group(1))
            material = match.group(2).strip()
            materials.append({
                'material': material,
                'quantity': quantity
            })

    return materials

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
        'stats': {},
        'crafting': {
            'materials': [],
            'workshop': None,
            'output': None
        }
    }

    content = soup.find('div', {'class': 'mw-parser-output'})
    if not content:
        return item_data

    # Extract from infobox
    infobox = content.find('table', {'class': 'infobox'})
    if infobox:
        # Get rarity
        for row in infobox.find_all('tr', {'class': 'data-tag'}):
            text = row.get_text(strip=True)
            if text in ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']:
                item_data['rarity'] = text

        # Get description/quote
        quote_row = infobox.find('tr', {'class': lambda x: x and 'quote' in x})
        if quote_row:
            item_data['description'] = quote_row.get_text(strip=True)

        # Get stats from infobox rows
        for row in infobox.find_all('tr', {'class': 'infobox-data'}):
            header = row.find('th')
            value = row.find('td')
            if header and value:
                stat_name = header.get_text(strip=True)
                stat_value = value.get_text(strip=True)
                item_data['stats'][stat_name] = stat_value

    # Find crafting section - ONLY look for specific crafting headings
    # Do NOT fall back to generic table search as that picks up upgrade recipes
    craft_section = content.find('h3', {'id': 'Required_Materials_to_Craft'})
    if not craft_section:
        craft_section = content.find('h3', {'id': 'Crafting'})

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
                            workshop = cells[2].get_text(strip=True) if len(cells) > 2 else None
                            output = cells[-1].get_text(strip=True) if len(cells) > 1 else None

                            if materials:
                                item_data['crafting'] = {
                                    'materials': materials,
                                    'workshop': workshop,
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

    # Exclude general navigation items
    exclude = ['Equipment', 'Augments', 'Shields', 'Healing', 'Quick Use',
               'Grenades', 'Traps', 'Weapons', category_name]

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
