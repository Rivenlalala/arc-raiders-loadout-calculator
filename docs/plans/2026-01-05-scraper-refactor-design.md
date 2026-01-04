# Scraper Refactor Design

## Overview

Refactor the scraper scripts from a messy collection of duplicated code into a production-quality Python package with proper structure, shared utilities, and wiki-aligned category mapping.

## Current Problems

1. **Massive code duplication** - `get_soup()`, `parse_recipe_cell()`, `parse_requirements_cell()` copy-pasted across 4+ files
2. **Hardcoded material lists** - `materials_scraper.py` has 50+ hardcoded material names
3. **Coupled healing/quick_use logic** - Uses heuristics to detect healing items, then separates in post-processing
4. **No shared configuration** - BASE_URL, headers, rate limiting duplicated everywhere
5. **Inconsistent error handling** - Some files have try/except, others crash
6. **Manual workflow** - Must run 4 scripts individually, then consolidate

## New Architecture

### Directory Structure

```
scraper/
├── src/
│   ├── __init__.py
│   ├── config.py          # URLs, category mappings, constants
│   ├── http.py            # Shared HTTP client with rate limiting
│   ├── logging.py         # Consistent logging setup
│   ├── parsers.py         # Recipe/workshop/infobox parsing
│   ├── models.py          # Dataclasses matching TypeScript types
│   └── scrapers/
│       ├── __init__.py
│       ├── base.py        # Abstract base scraper class
│       ├── weapons.py
│       ├── equipment.py   # Section-aware scraper
│       ├── modifications.py
│       ├── materials.py   # Discovers from Category pages
│       └── ammo.py
├── output/                # Intermediate JSON files
│   ├── weapons.json
│   ├── equipment.json
│   ├── modifications.json
│   ├── materials.json
│   └── ammo.json
├── main.py               # CLI entry point
└── requirements.txt
```

### Category Mapping

Wiki sections map directly to output categories:

| Wiki Source | Category |
|-------------|----------|
| Augments page | `augments` |
| Shields page | `shields` |
| Quick_Use → Utility | `utility` |
| Quick_Use → Gadget | `gadget` |
| Quick_Use → Medical | `medical` |
| Quick_Use → Shield | `shield_recharge` |
| Quick_Use → Stamina | `stamina` |
| Grenades → Grenades | `grenades` |
| Traps → Grenade Traps + Mines | `traps` |

Materials discovered dynamically from:
- `/wiki/Category:Basic_Material` (atomic, cannot decompose)
- `/wiki/Category:Refined_Material` (craftable)
- `/wiki/Category:Topside_Material` (mixed)

## Key Components

### config.py

```python
BASE_URL = "https://arcraiders.wiki"

MATERIAL_CATEGORIES = {
    "basic": "/wiki/Category:Basic_Material",
    "refined": "/wiki/Category:Refined_Material",
    "topside": "/wiki/Category:Topside_Material",
}

EQUIPMENT_SECTIONS = {
    "/wiki/Quick_Use": {
        "Utility": "utility",
        "Gadget": "gadget",
        "Medical": "medical",
        "Shield": "shield_recharge",
        "Stamina": "stamina",
    },
    "/wiki/Grenades": {
        "Grenades": "grenades",
    },
    "/wiki/Traps": {
        "Grenade Traps": "traps",
        "Mines": "traps",
    },
}

SIMPLE_PAGES = {
    "/wiki/Augments": "augments",
    "/wiki/Shields": "shields",
    "/wiki/Weapons": "weapons",
    "/wiki/Weapon_Modifications": "modifications",
}
```

### http.py

Thread-safe HTTP client with rate limiting:

```python
import threading
import time
import requests
from bs4 import BeautifulSoup

class WikiClient:
    def __init__(self, base_url: str, delay: float = 0.3):
        self.base_url = base_url
        self.delay = delay
        self.session = requests.Session()
        self.session.headers = {"User-Agent": "ArcRaidersCalc/2.0"}
        self._lock = threading.Lock()
        self._last_request = 0.0

    def get_soup(self, path: str, retries: int = 3) -> BeautifulSoup:
        """Fetch page with thread-safe rate limiting and retries."""
        for attempt in range(retries):
            try:
                with self._lock:
                    elapsed = time.time() - self._last_request
                    if elapsed < self.delay:
                        time.sleep(self.delay - elapsed)
                    self._last_request = time.time()

                response = self.session.get(f"{self.base_url}{path}")
                response.raise_for_status()
                return BeautifulSoup(response.text, "html.parser")
            except requests.RequestException as e:
                if attempt == retries - 1:
                    raise
                time.sleep(2 ** attempt)
```

### parsers.py

Shared parsing functions (no more duplication):

```python
def parse_recipe_cell(cell: Tag) -> list[CraftingMaterial]:
    """Parse '3x Metal Parts\n2x Wires' into structured list."""

def parse_workshop_cell(cell: Tag) -> tuple[str | None, bool]:
    """Extract workshop name and blueprint_required flag."""

def parse_infobox(infobox: Tag) -> dict:
    """Extract rarity, stats, description from infobox table."""

def find_crafting_table(content: Tag) -> Tag | None:
    """Find wikitable after 'Crafting' or 'Required Materials' heading."""
```

### models.py

Dataclasses matching TypeScript types:

```python
@dataclass
class CraftingMaterial:
    material: str
    quantity: int

@dataclass
class CraftingInfo:
    materials: list[CraftingMaterial]
    workshop: str | None = None

@dataclass
class EquipmentItem:
    id: str
    name: str
    image: str | None
    category: str
    rarity: str | None
    description: str | None
    special_effect: str | None
    stats: dict[str, str]
    crafting: CraftingInfo

@dataclass
class Equipment:
    augments: list[EquipmentItem]
    shields: list[EquipmentItem]
    utility: list[EquipmentItem]
    gadget: list[EquipmentItem]
    medical: list[EquipmentItem]
    shield_recharge: list[EquipmentItem]
    stamina: list[EquipmentItem]
    grenades: list[EquipmentItem]
    traps: list[EquipmentItem]

@dataclass
class GameData:
    version: str
    last_updated: str
    weapons: list[Weapon]
    equipment: Equipment
    modifications: list[Modification]
    materials: list[Material]
    ammo: list[Ammo]
```

### scrapers/equipment.py

Section-aware equipment scraper:

```python
class EquipmentScraper(BaseScraper):
    def run(self) -> dict[str, list[EquipmentItem]]:
        results = {}

        # Handle sectioned pages (Quick_Use, Grenades, Traps)
        for page_path, section_map in EQUIPMENT_SECTIONS.items():
            soup = self.client.get_soup(page_path)
            for section_name, category in section_map.items():
                items = self.extract_items_from_section(soup, section_name)
                results.setdefault(category, []).extend(items)

        # Handle simple pages (Augments, Shields)
        for page_path, category in [("/wiki/Augments", "augments"),
                                      ("/wiki/Shields", "shields")]:
            soup = self.client.get_soup(page_path)
            items = self.extract_all_items(soup)
            results[category] = items

        return results

    def extract_items_from_section(self, soup, section_name: str) -> list:
        """Find section header, extract items from table below it."""
        header = soup.find(["h2", "h3"], string=section_name)
        if not header:
            return []
        table = header.find_next("table", class_="wikitable")
        return self.parse_item_table(table)
```

### scrapers/materials.py

Dynamic discovery from Category pages:

```python
class MaterialsScraper(BaseScraper):
    def run(self) -> list[Material]:
        materials = []

        for category_type, path in MATERIAL_CATEGORIES.items():
            soup = self.client.get_soup(path)
            item_paths = self.extract_category_links(soup)

            for item_path in item_paths:
                material = self.scrape_material_page(item_path)
                material["material_type"] = category_type
                materials.append(material)

        return materials
```

### main.py

CLI entry point with commands:

```python
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=[
        "all",           # Run all scrapers + consolidate
        "weapons",       # Run single scraper
        "equipment",
        "modifications",
        "materials",
        "ammo",
        "images",
        "consolidate",   # Just combine existing JSON files
    ])
    parser.add_argument("--parallel", action="store_true",
                        help="Run scrapers in parallel (for 'all' command)")
    args = parser.parse_args()
```

## Usage

```bash
# Run everything (parallel)
python main.py all --parallel

# Run just one scraper
python main.py weapons

# Consolidate existing files (no re-scraping)
python main.py consolidate
```

## Output Files

**Intermediate** (in `scraper/output/`):
- `weapons.json`
- `equipment.json`
- `modifications.json`
- `materials.json`
- `ammo.json`

**Final** (in `data/`):
- `game_data.json`

## Frontend Changes Required

Update `app/src/types/index.ts` Equipment interface:

```typescript
export interface Equipment {
  augments: EquipmentItem[];
  shields: EquipmentItem[];
  utility: EquipmentItem[];       // new
  gadget: EquipmentItem[];        // new
  medical: EquipmentItem[];       // renamed from healing
  shield_recharge: EquipmentItem[]; // new
  stamina: EquipmentItem[];       // new
  grenades: EquipmentItem[];
  traps: EquipmentItem[];
}
```

Update `app/src/data/gameData.ts` helper functions to match.

## Benefits

| Aspect | Before | After |
|--------|--------|-------|
| Code duplication | 4x copy-paste | Single shared module |
| Material discovery | 50+ hardcoded items | Dynamic from Category pages |
| Category assignment | Heuristics + post-processing | Section header parsing |
| Entry point | Run 4 scripts manually | Single CLI with commands |
| Parallelization | None | Optional `--parallel` |
| Error handling | Inconsistent, crashes | Retries, per-item recovery |
