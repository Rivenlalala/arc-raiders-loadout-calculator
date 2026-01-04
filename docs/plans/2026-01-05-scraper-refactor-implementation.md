# Scraper Refactor Implementation Plan

## Phase 1: Core Infrastructure

### Task 1.1: Create package structure
- Create `scraper/src/` directory
- Create `__init__.py` files
- Create `scraper/output/` directory for intermediate JSON
- Update `.gitignore` to exclude `scraper/output/*.json` (optional, may want to track)

### Task 1.2: Implement config.py
- Define `BASE_URL`
- Define `MATERIAL_CATEGORIES` dict (basic, refined, topside paths)
- Define `EQUIPMENT_SECTIONS` dict (Quick_Use, Grenades, Traps section mappings)
- Define `SIMPLE_PAGES` dict (Augments, Shields, Weapons, Modifications)

### Task 1.3: Implement http.py
- Create `WikiClient` class
- Implement thread-safe rate limiting with `threading.Lock`
- Implement retry logic with exponential backoff
- Implement `get_soup(path)` method

### Task 1.4: Implement logging.py
- Create `setup_logger(name, verbose)` function
- Configure format with timestamp and scraper name

### Task 1.5: Implement models.py
- Create `CraftingMaterial` dataclass
- Create `CraftingInfo` dataclass
- Create `WeaponUpgrade` dataclass
- Create `Weapon` dataclass
- Create `EquipmentItem` dataclass
- Create `Modification` dataclass
- Create `Material` dataclass
- Create `Ammo` dataclass
- Create `Equipment` dataclass (with all 9 categories)
- Create `GameData` dataclass
- Implement `to_json()` helper using `dataclasses.asdict()`

### Task 1.6: Implement parsers.py
- Port `parse_recipe_cell()` from existing code
- Port `parse_workshop_cell()` (extract workshop + blueprint_required)
- Create `parse_infobox()` for rarity, stats, description
- Create `find_crafting_table()` to locate wikitable after heading
- Create `find_section_table()` to locate table after specific section header
- Create `clean_string()` for text cleanup
- Create `extract_item_links()` for getting links from tables

## Phase 2: Base Scraper

### Task 2.1: Implement scrapers/base.py
- Create `BaseScraper` abstract class
- Inject `WikiClient` via constructor
- Inject logger via constructor
- Implement `extract_item_links(soup)` method
- Define abstract `scrape_item_page(path)` method
- Define abstract `run()` method
- Implement error handling wrapper for per-item scraping

## Phase 3: Individual Scrapers

### Task 3.1: Implement scrapers/weapons.py
- Create `WeaponsScraper(BaseScraper)`
- Implement `run()`: fetch weapons list, scrape each
- Implement `scrape_item_page()`: extract weapon data
  - Parse infobox for category, rarity, ammo_type, modification_slots
  - Parse crafting table for base craft materials
  - Parse upgrade table for tier upgrades
- Save to `output/weapons.json`

### Task 3.2: Implement scrapers/equipment.py
- Create `EquipmentScraper(BaseScraper)`
- Implement `run()`:
  - Loop through `EQUIPMENT_SECTIONS` (Quick_Use, Grenades, Traps)
  - For each page, extract items by section header
  - Loop through `SIMPLE_PAGES` for Augments, Shields
- Implement `extract_items_from_section(soup, section_name)`
- Implement `scrape_item_page()`: extract equipment data
  - Parse infobox for rarity, description, special_effect, stats
  - Parse crafting table for materials
- Save to `output/equipment.json`

### Task 3.3: Implement scrapers/modifications.py
- Create `ModificationsScraper(BaseScraper)`
- Implement `run()`: fetch mods list, scrape each
- Implement `scrape_item_page()`: extract mod data
  - Parse infobox for rarity, effects, stats
  - Extract slot_type from page text
  - Extract compatible_weapons from data-warning row
  - Parse crafting table for materials
- Save to `output/modifications.json`

### Task 3.4: Implement scrapers/materials.py
- Create `MaterialsScraper(BaseScraper)`
- Implement `run()`:
  - Loop through `MATERIAL_CATEGORIES`
  - Fetch each Category page
  - Extract item links from category listing
  - Scrape each material page
- Implement `extract_category_links(soup)` for Category:* page structure
- Implement `scrape_item_page()`: extract material data
  - Parse infobox for rarity, weight, stack_size
  - Parse crafting table (if exists) for recipe + output_quantity
- Save to `output/materials.json`

### Task 3.5: Implement scrapers/ammo.py
- Create `AmmoScraper(BaseScraper)`
- Hardcode ammo types list (only 6 items, rarely changes):
  - Light_Ammo, Medium_Ammo, Heavy_Ammo, Shotgun_Ammo, Energy_Clip, Launcher_Ammo
- Implement `run()`: scrape each ammo page
- Implement `scrape_item_page()`: extract ammo data
- Save to `output/ammo.json`

### Task 3.6: Implement scrapers/images.py (optional, lower priority)
- Create `ImageScraper`
- Takes `GameData` as input
- Downloads images for all items
- Saves to `../app/public/images/`

## Phase 4: Orchestration

### Task 4.1: Implement consolidate.py
- Load all intermediate JSON files from `output/`
- Combine into `GameData` structure
- Apply any final transformations (normalize slot types, etc.)
- Save to `../data/game_data.json`

### Task 4.2: Implement main.py
- Create argument parser with commands:
  - `all` - run all scrapers + consolidate
  - `weapons` - run single scraper
  - `equipment`, `modifications`, `materials`, `ammo`
  - `images` - run image scraper
  - `consolidate` - just combine existing JSON
- Add `--parallel` flag for concurrent execution
- Add `--verbose` flag for debug logging
- Implement `run_all_scrapers(parallel=False)`
- Implement `run_single_scraper(name)`
- Implement parallel execution with `ThreadPoolExecutor`

### Task 4.3: Create requirements.txt
```
requests>=2.28.0
beautifulsoup4>=4.11.0
lxml>=4.9.0
```

## Phase 5: Frontend Updates

### Task 5.1: Update TypeScript types
- Update `app/src/types/index.ts`:
  - Change `Equipment` interface to include all 9 categories
  - Remove `healing`, `quick_use`
  - Add `utility`, `gadget`, `medical`, `shield_recharge`, `stamina`

### Task 5.2: Update gameData.ts
- Update helper functions:
  - Remove `getHealing()`, `getQuickUse()`
  - Add `getUtility()`, `getGadget()`, `getMedical()`, `getShieldRecharge()`, `getStamina()`
- Update `getEquipmentById()` to include all categories

### Task 5.3: Update LoadoutBuilder components
- Update any components that reference `healing` or `quick_use`
- Map to new category names

### Task 5.4: Update Loadout type
- Update `Loadout` interface if needed
- May need to rename `utilities` to match new structure

## Phase 6: Cleanup

### Task 6.1: Delete old scraper files
- Delete `scraper/weapon_scraper.py`
- Delete `scraper/equipment_scraper.py`
- Delete `scraper/modifications_scraper.py`
- Delete `scraper/materials_scraper.py`
- Delete `scraper/consolidate_data.py`
- Delete `scraper/image_scraper.py`

### Task 6.2: Update CLAUDE.md
- Update commands section with new usage:
  ```bash
  cd scraper && python main.py all --parallel
  ```

### Task 6.3: Run full scrape and verify
- Run `python main.py all --parallel`
- Compare output with existing `game_data.json`
- Verify frontend still works

## Execution Order

1. Phase 1 (infrastructure) - can be done in parallel
2. Phase 2 (base scraper) - depends on Phase 1
3. Phase 3 (individual scrapers) - each scraper can be done in parallel
4. Phase 4 (orchestration) - depends on Phase 3
5. Phase 5 (frontend) - can start after Phase 4, or in parallel if interface is stable
6. Phase 6 (cleanup) - after everything verified working

## Estimated Complexity

| Phase | Tasks | Complexity |
|-------|-------|------------|
| Phase 1 | 6 | Low - mostly boilerplate |
| Phase 2 | 1 | Low - simple base class |
| Phase 3 | 6 | Medium - porting existing logic |
| Phase 4 | 3 | Low - orchestration |
| Phase 5 | 4 | Medium - frontend changes |
| Phase 6 | 3 | Low - cleanup |

Total: 23 tasks
