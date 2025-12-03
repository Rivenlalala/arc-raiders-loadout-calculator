# CLAUDE.md

This file provides guidance for Claude Code when working on this repository.

## Project Overview

Arc Raiders Loadout Calculator - a React SPA for planning game loadouts and calculating required crafting materials.

## Key Commands

```bash
# Development
cd app && npm run dev

# Build
cd app && npm run build

# Deploy to Cloudflare Pages
cd app && npx wrangler pages deploy dist

# Update game data
cd scraper && python consolidate_data.py
cp data/game_data.json app/src/data/
```

## Architecture

### Frontend (app/)
- **React 18 + TypeScript + Vite** - Main application
- **Tailwind CSS** - Styling with custom theme
- **lz-string** - URL compression for shareable loadouts

### Data Pipeline (scraper/)
- Python scrapers pull data from arcraiders.wiki
- `consolidate_data.py` normalizes and combines all data into `game_data.json`
- Copy JSON to `app/src/data/` after regenerating

### Key Files
- `app/src/App.tsx` - Main app with share/reset functionality
- `app/src/components/LoadoutBuilder/LoadoutBuilder.tsx` - Loadout configuration UI
- `app/src/components/Calculator/ResourceTree.tsx` - Resource calculation display
- `app/src/utils/shareLoadout.ts` - URL encoding/decoding with lz-string compression
- `app/src/data/gameData.ts` - Data access functions
- `scraper/consolidate_data.py` - Data normalization (includes slot type mapping)

## Code Patterns

### Loadout State
```typescript
interface Loadout {
  weapon1: LoadoutWeapon | null;
  weapon2: LoadoutWeapon | null;
  augment: string | null;
  shield: string | null;
  healing: LoadoutItem[];
  utilities: LoadoutItem[];
  grenades: LoadoutItem[];
  traps: LoadoutItem[];
  ammo: { type: string; quantity: number }[];
}
```

### Selection Styling
- Selected items use blue glow + scale effect
- Rarity borders: Common (gray), Uncommon (green), Rare (blue), Epic (purple), Legendary (orange)

### Consumable Layout
- Fixed height containers (`h-[100px]`) prevent layout shift
- Fixed icon wrapper (`w-14 h-14`) for scale transforms
- +/- buttons appear below name when selected

## Deployment

Cloudflare Pages with `wrangler.jsonc`:
```json
{
  "name": "arc-raiders-loadout-calculator",
  "compatibility_date": "2025-12-03",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

## Data Notes

- `normalize_slot_type()` in consolidate_data.py maps slot names (e.g., "Shotgun Muzzle" → "Shotgun-Muzzle")
- Items with `workshop == 'Inventory'` are filtered out (in-raid only crafting)
- Workshop strings like "Workbench 1orInventory" are cleaned to "Workbench 1"
