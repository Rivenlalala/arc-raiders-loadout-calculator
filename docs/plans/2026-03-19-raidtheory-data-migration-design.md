# RaidTheory Data Migration & i18n Design

**Date**: 2026-03-19
**Status**: Approved

## Motivation

Replace custom Python scrapers (`scraper/`) with the community-maintained [RaidTheory/arcraiders-data](https://github.com/RaidTheory/arcraiders-data) npm package. Simultaneously add full i18n support (English + Simplified Chinese) since the RaidTheory data ships with translations in 20 languages.

Goals:
- Remove all custom scrapers — they are the main barrier to maintaining this project
- Clean-slate TypeScript type redesign using a single `GameItem` type
- Full i18n (item data + UI chrome) with `react-i18next`
- Keep all RaidTheory fields on each item for future feature use

## Data Source

- **Package**: `npm install RaidTheory/arcraiders-data` (installed via GitHub URL)
- **Import**: Vite `import.meta.glob` to load `items/*.json` at build time
- **Attribution**: Footer link to https://github.com/RaidTheory/arcraiders-data and https://arctracker.io (per their README)
- **Hideout data**: Also import `hideout/*.json` for workshop/bench information

## Supported Locales

- `en` (English)
- `zh-CN` (Simplified Chinese)

Other locale data from RaidTheory is stripped at load time to reduce memory.

## i18n Architecture

- **Framework**: `react-i18next` for all UI strings
- **UI translation files**: `app/src/locales/en.json` and `app/src/locales/zh-CN.json` for UI chrome (tab names, buttons, headers, tooltips, etc.)
- **Item data**: Localized names, descriptions, and effect labels come directly from RaidTheory's JSON — not duplicated into translation files
- **Language toggle**: Simple EN / 中文 toggle in the app header
- **Access pattern**: `useTranslation()` for UI strings, `item.name[locale]` for item data via a locale context/hook

## Type Design

Single `GameItem` type that mirrors the full RaidTheory schema 1:1, with only `category` added as a derived field. No fields are stripped — all raw data is preserved for future feature use.

```typescript
type Locale = 'en' | 'zh-CN';
type LocalizedString = Record<Locale, string>;
type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
type ItemCategory =
  | 'weapon'
  | 'augment'
  | 'shield'
  | 'modification'
  | 'healing'
  | 'grenade'
  | 'trap'
  | 'utility'
  | 'ammunition'
  | 'material';

interface ItemEffect {
  value: string | number;
  label: LocalizedString;
}

interface Vendor {
  trader: string;
  cost: Record<string, number>;
  limit?: number;
  refreshSeconds?: number;
}

interface GameItem {
  // Identity
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  type: string;              // original RaidTheory type ("Hand Cannon", "Quick Use", etc.)
  category: ItemCategory;    // derived via heuristics at load time
  rarity: Rarity | null;

  // Physical
  value: number;
  weightKg: number;
  stackSize: number;
  imageUrl: string | null;   // mapped from imageFilename

  // Stats
  effects: Record<string, ItemEffect>;

  // Crafting
  recipe: Record<string, number> | null;
  craftBench: string | string[] | null;
  stationLevelRequired: number | null;
  craftQuantity: number;     // defaults to 1

  // Weapon-specific
  isWeapon: boolean;
  modSlots: Record<string, string[]> | null;
  upgradeCost: Record<string, number> | null;
  upgradesTo: string | null;
  repairCost: Record<string, number> | null;
  repairDurability: number | null;

  // Mod-specific
  compatibleWith: string[] | null;

  // Economy
  blueprintLocked: boolean;
  recyclesInto: Record<string, number> | null;
  salvagesInto: Record<string, number> | null;
  vendors: Vendor[] | null;

  // Metadata
  updatedAt: string | null;
  addedIn: string | null;
}
```

### Loadout Type

Simplified — tier is encoded in the item ID:

```typescript
interface LoadoutWeapon {
  id: string;      // "kettle_ii" — no separate tier field needed
  mods: string[];
}

interface LoadoutItem {
  id: string;
  quantity: number;
}

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

## Category Classification Heuristics

Applied at load time in `gameData.ts`:

| Priority | Condition | Category |
|----------|-----------|----------|
| 1 | `isWeapon === true` | `weapon` |
| 2 | `type === "Augment"` | `augment` |
| 3 | `type === "Shield"` | `shield` |
| 4 | `type === "Modification"` | `modification` |
| 5 | `type === "Ammunition"` | `ammunition` |
| 6 | `type === "Quick Use"` + has `Healing` effect key | `healing` |
| 7 | `type === "Quick Use"` + ID contains `_trap` or `_mine` | `trap` |
| 8 | `type === "Quick Use"` + has `Damage` effect key | `grenade` |
| 9 | `type === "Quick Use"` (remaining) | `utility` |
| 10 | Everything else | `material` |

## Weapon Tier Grouping

RaidTheory stores each tier as a separate item (`anvil_i`, `anvil_ii`, `anvil_iii`, `anvil_iv`) linked by `upgradesTo`. The UI groups these for weapon selection using a view-layer concept:

```typescript
interface WeaponFamily {
  baseId: string;         // "anvil"
  name: LocalizedString;  // {en: "Anvil", "zh-CN": "铁砧"}
  weaponType: string;     // "Hand Cannon"
  tiers: GameItem[];      // [anvil_i, anvil_ii, anvil_iii, anvil_iv]
}
```

Built at load time by following the `upgradesTo` chain. `WeaponSelector` displays weapon families; tier picker selects among tiers within a family.

## Recipe & Resource Tree

Recipes change from name-based arrays to ID-based maps:

```
Before: [{material: "Metal Parts", quantity: 5}]
After:  {metal_parts: 5, rubber_parts: 8}
```

`ResourceTree` resolves recipes by looking up items by ID. Cleaner and more stable than fuzzy name matching.

## Component Impact

| Component | Change |
|-----------|--------|
| `types/index.ts` | Full rewrite — `GameItem`, `Loadout`, locale types |
| `gameData.ts` | Full rewrite — imports from npm package, classifies, groups weapon families |
| `App.tsx` | Add i18n provider, language toggle |
| `LoadoutBuilder` | Update to `GameItem` + `category` filtering |
| `WeaponSelector` | Use `WeaponFamily` grouping, tier picker uses item IDs |
| `ModSelector` | Simplified — `modSlots` already has compatible mod IDs |
| `ResourceTree` | Refactor to ID-based recipe lookups |
| `ItemCard` / `ItemSelector` | Use `item.name[locale]` for display |
| `shareLoadout.ts` | Update encoding — no separate tier field, new ID format |
| `MobileTooltip` / `SlideOutPanel` | Use localized strings |
| New: `locales/en.json`, `locales/zh-CN.json` | UI string translations |
| New: i18n config + locale hook | i18n setup and context access |

## What Gets Deleted

- `scraper/` — all Python scrapers, `consolidate_data.py`, requirements.txt
- `app/src/data/game_data.json` — replaced by npm package import
- `data/` directory — no longer needed

## Breaking Changes

- **Shared loadout URLs** will break. Item IDs change format (e.g., `"kettle"` + tier=2 becomes `"kettle_ii"`). Old URLs cannot be decoded with new data.

## Attribution

Per RaidTheory's README, add attribution link in the app footer:
- https://github.com/RaidTheory/arcraiders-data
- https://arctracker.io
