# CLAUDE.md

This file provides guidance for Claude Code when working on this repository.

## Project Overview

Arc Raiders Loadout Calculator - a React SPA for planning game loadouts and calculating required crafting materials. Deployed at https://arc-calculator.xyz/

## Project Structure

```
├── app/                          # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Calculator/       # ResourceTree - crafting material display
│   │   │   ├── LoadoutBuilder/   # LoadoutBuilder, WeaponSelector, ModSelector
│   │   │   └── ui/               # ItemCard, ItemSelector, MobileTooltip, SlideOutPanel
│   │   ├── data/                 # gameData.ts access layer + game_data.json
│   │   ├── hooks/                # useIsMobile responsive hook
│   │   ├── lib/                  # cn() utility (clsx + tailwind-merge)
│   │   ├── locales/              # i18n translation files (en.json, zh-CN.json)
│   │   ├── i18n.ts               # i18next configuration
│   │   ├── types/                # TypeScript interfaces
│   │   └── utils/                # shareLoadout URL compression
│   └── wrangler.jsonc            # Cloudflare Pages deployment config
└── docs/plans/                   # Design documents for features
```

## Key Commands

```bash
# Development
cd app && npm run dev

# Build (TypeScript check + Vite bundle)
cd app && npm run build

# Lint
cd app && npm run lint

# Deploy to Cloudflare Pages
cd app && npx wrangler pages deploy dist

# Update game data (pull latest from RaidTheory)
cd app && npm update arcraiders-data
```

## Architecture

### Frontend (app/)
- **React 19 + TypeScript + Vite 7** - Main application
- **Tailwind CSS v4** - Styling with custom theme
- **lucide-react** - Icon library
- **lz-string** - URL compression for shareable loadouts
- **State management** - React hooks only (useState, useEffect), no external state library
- **Strict TypeScript** - All strict checks enabled, unused vars/params are errors

### Data Pipeline
- Game data sourced from `arcraiders-data` npm package ([RaidTheory/arcraiders-data](https://github.com/RaidTheory/arcraiders-data))
- Loaded at build time via Vite virtual module plugin (`virtual:arcraiders-items`)
- Processed into typed `GameItem[]` with category classification and weapon family grouping
- No custom scrapers — community-maintained data

### Key Components
- `App.tsx` - Main app with share/reset, global loadout state
- `LoadoutBuilder.tsx` - Loadout configuration (weapons, augments, shields, consumables)
- `WeaponSelector.tsx` - Weapon selection with rarity filtering and stats
- `ModSelector.tsx` - Weapon modification selector (slot-type and tier-based)
- `ResourceTree.tsx` - Hierarchical crafting tree with collapsible nodes
- `ItemCard.tsx` / `ItemSelector.tsx` - Reusable item display and selection
- `MobileTooltip.tsx` / `SlideOutPanel.tsx` - Mobile-responsive UI components
- `useIsMobile.ts` - Responsive hook (768px breakpoint)

### Key Files
- `app/src/data/gameData.ts` - Data access layer — imports from arcraiders-data, classifies items, builds weapon families
- `app/src/utils/shareLoadout.ts` - URL encoding/decoding with lz-string compression
- `app/src/types/index.ts` - All TypeScript interfaces (Loadout, GameItem, ResourceNode, etc.)

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

```typescript
interface LoadoutWeapon {
  id: string;   // tier encoded in ID, e.g., "kettle_ii"
  mods: string[];
}
```

### Selection Styling
- Selected items use blue glow + scale effect
- Rarity borders: Common (gray), Uncommon (green), Rare (blue), Epic (purple), Legendary (orange)

### Consumable Layout
- Fixed height containers (`h-[100px]`) prevent layout shift
- Fixed icon wrapper (`w-14 h-14`) for scale transforms
- +/- buttons appear below name when selected

### Mobile Responsiveness
- `useIsMobile` hook detects viewport < 768px
- `MobileTooltip` renders tooltips as bottom sheets on mobile
- `SlideOutPanel` for mobile-friendly selection panels

## Testing

No test framework is currently configured. Quality assurance relies on TypeScript strict mode, ESLint, and manual testing.

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

## i18n

- Framework: `react-i18next` with `i18next`
- Supported locales: `en` (English), `zh-CN` (Simplified Chinese)
- UI string translations: `app/src/locales/en.json`, `app/src/locales/zh-CN.json`
- Item data translations: Embedded in RaidTheory data (accessed via `item.name[locale]`)
- Language toggle in app header, persisted to localStorage
- Add new UI strings to both locale files when adding features

## Attribution

Game data from [RaidTheory/arcraiders-data](https://github.com/RaidTheory/arcraiders-data) and [arctracker.io](https://arctracker.io). Attribution links displayed in the app footer per their README requirements.
