#!/usr/bin/env python3
"""
Image scraper for Arc Raiders items.
Downloads item images from the wiki and saves them locally.
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import os
import re
from urllib.parse import urljoin, unquote

BASE_URL = "https://arcraiders.wiki"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def get_soup(url):
    """Fetch a URL and return BeautifulSoup object."""
    print(f"  Fetching: {url}")
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    time.sleep(0.3)  # Be polite to the server
    return BeautifulSoup(response.text, 'html.parser')

def download_image(img_url, save_path):
    """Download an image and save it to the specified path."""
    try:
        response = requests.get(img_url, headers=HEADERS, stream=True)
        response.raise_for_status()

        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        return True
    except Exception as e:
        print(f"    Error downloading {img_url}: {e}")
        return False

def extract_image_url(soup):
    """Extract the main item image URL from a wiki page."""
    # Look for image in infobox
    infobox = soup.find('table', {'class': 'infobox'})
    if infobox:
        # Find the main image (usually in data-image row or first image)
        img_row = infobox.find('tr', {'class': 'data-image'})
        if img_row:
            img = img_row.find('img')
            if img:
                src = img.get('src', '')
                if src:
                    return urljoin(BASE_URL, src)

        # Fallback: find first significant image in infobox
        for img in infobox.find_all('img'):
            src = img.get('src', '')
            # Skip tiny icons
            width = img.get('width', '100')
            try:
                if int(width) >= 50:
                    return urljoin(BASE_URL, src)
            except:
                if src and '/images/' in src:
                    return urljoin(BASE_URL, src)

    return None

def sanitize_filename(name):
    """Convert item name to safe filename."""
    # Replace special characters
    name = name.lower()
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[\s]+', '_', name)
    return name

def scrape_images_for_category(items, category, base_path):
    """Scrape images for a list of items."""
    results = {}

    for item in items:
        name = item.get('name', '')
        item_id = item.get('id', sanitize_filename(name))

        # Build wiki URL
        wiki_name = name.replace(' ', '_').replace("'", "%27")
        url = f"{BASE_URL}/wiki/{wiki_name}"

        print(f"  Processing: {name}")

        try:
            soup = get_soup(url)
            img_url = extract_image_url(soup)

            if img_url:
                # Determine file extension
                ext = '.png'
                if '.jpg' in img_url.lower() or '.jpeg' in img_url.lower():
                    ext = '.jpg'
                elif '.gif' in img_url.lower():
                    ext = '.gif'
                elif '.webp' in img_url.lower():
                    ext = '.webp'

                filename = f"{item_id}{ext}"
                save_path = os.path.join(base_path, category, filename)

                if download_image(img_url, save_path):
                    results[item_id] = f"images/{category}/{filename}"
                    print(f"    ✓ Saved: {filename}")
                else:
                    results[item_id] = None
            else:
                print(f"    ✗ No image found")
                results[item_id] = None

        except Exception as e:
            print(f"    ✗ Error: {e}")
            results[item_id] = None

        time.sleep(0.2)  # Rate limiting

    return results

def main():
    print("=" * 60)
    print("Arc Raiders Image Scraper")
    print("=" * 60)

    # Load game data
    print("\nLoading game data...")
    with open('../data/game_data.json', 'r', encoding='utf-8') as f:
        game_data = json.load(f)

    # Output directory for images
    base_path = '../docs/images'
    os.makedirs(base_path, exist_ok=True)

    all_image_paths = {}

    # Scrape weapon images
    print("\n[1] Scraping weapon images...")
    weapons = game_data.get('weapons', [])
    all_image_paths['weapons'] = scrape_images_for_category(weapons, 'weapons', base_path)

    # Scrape equipment images
    equipment = game_data.get('equipment', {})

    print("\n[2] Scraping augment images...")
    all_image_paths['augments'] = scrape_images_for_category(
        equipment.get('augments', []), 'augments', base_path)

    print("\n[3] Scraping shield images...")
    all_image_paths['shields'] = scrape_images_for_category(
        equipment.get('shields', []), 'shields', base_path)

    print("\n[4] Scraping healing images...")
    all_image_paths['healing'] = scrape_images_for_category(
        equipment.get('healing', []), 'healing', base_path)

    print("\n[5] Scraping quick use images...")
    all_image_paths['quick_use'] = scrape_images_for_category(
        equipment.get('quick_use', []), 'quick_use', base_path)

    print("\n[6] Scraping grenade images...")
    all_image_paths['grenades'] = scrape_images_for_category(
        equipment.get('grenades', []), 'grenades', base_path)

    print("\n[7] Scraping trap images...")
    all_image_paths['traps'] = scrape_images_for_category(
        equipment.get('traps', []), 'traps', base_path)

    # Scrape modification images
    print("\n[8] Scraping modification images...")
    mods = game_data.get('modifications', [])
    all_image_paths['modifications'] = scrape_images_for_category(mods, 'modifications', base_path)

    # Scrape material images
    print("\n[9] Scraping material images...")
    materials = game_data.get('materials', [])
    all_image_paths['materials'] = scrape_images_for_category(materials, 'materials', base_path)

    # Scrape ammo images
    print("\n[10] Scraping ammo images...")
    ammo = game_data.get('ammo', [])
    all_image_paths['ammo'] = scrape_images_for_category(ammo, 'ammo', base_path)

    # Save image path mapping
    output_file = 'image_paths.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_image_paths, f, indent=2, ensure_ascii=False)

    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)

    total = 0
    found = 0
    for category, paths in all_image_paths.items():
        cat_total = len(paths)
        cat_found = sum(1 for p in paths.values() if p is not None)
        total += cat_total
        found += cat_found
        print(f"{category}: {cat_found}/{cat_total} images")

    print(f"\nTotal: {found}/{total} images downloaded")
    print(f"Image paths saved to {output_file}")

if __name__ == '__main__':
    main()
