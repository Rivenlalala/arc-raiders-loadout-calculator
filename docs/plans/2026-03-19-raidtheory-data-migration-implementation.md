# RaidTheory Data Migration & i18n Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace custom Python scrapers with the RaidTheory/arcraiders-data npm package, redesign TypeScript types around a single `GameItem`, and add full i18n support (English + Simplified Chinese).

**Architecture:** Install arcraiders-data as npm dependency. Use a Vite virtual module plugin to load all item JSON files at build time. A rewritten `gameData.ts` processes raw items into typed `GameItem[]` with category classification and weapon family grouping. `react-i18next` handles all UI string translations. Every component is updated to use localized strings and the new data access API.

**Tech Stack:** React 19, TypeScript, Vite 7, react-i18next, arcraiders-data (npm from GitHub), Tailwind CSS v4

**Design doc:** `docs/plans/2026-03-19-raidtheory-data-migration-design.md`

---

### Task 1: Install Dependencies

**Files:**
- Modify: `app/package.json`
- Modify: `app/package-lock.json` (auto-generated)

**Step 1: Install arcraiders-data and i18n packages**

```bash
cd app && npm install RaidTheory/arcraiders-data react-i18next i18next
```

**Step 2: Verify installation**

```bash
ls app/node_modules/arcraiders-data/items/anvil_i.json
```

Expected: file exists.

**Step 3: Commit**

```bash
git add app/package.json app/package-lock.json
git commit -m "chore: add arcraiders-data and react-i18next dependencies"
```

---

### Task 2: Rewrite TypeScript Types

**Files:**
- Rewrite: `app/src/types/index.ts`

**Step 1: Write the new type definitions**

Replace the entire file with the new types from the design doc. Key types:

```typescript
// Locale types
export type Locale = 'en' | 'zh-CN';
export type LocalizedString = Record<Locale, string>;

// Rarity
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

// Item categories (derived via heuristics at load time)
export type ItemCategory =
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

// Effect with localized label
export interface ItemEffect {
  value: string | number;
  label: LocalizedString;
}

// Vendor entry
export interface Vendor {
  trader: string;
  cost: Record<string, number>;
  limit?: number;
  refreshSeconds?: number;
}

// Single unified game item type — mirrors RaidTheory schema 1:1 + derived category
export interface GameItem {
  // Identity
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  type: string;
  category: ItemCategory;
  rarity: Rarity | null;

  // Physical
  value: number;
  weightKg: number;
  stackSize: number;
  imageUrl: string | null;

  // Stats
  effects: Record<string, ItemEffect>;

  // Crafting
  recipe: Record<string, number> | null;
  craftBench: string | string[] | null;
  stationLevelRequired: number | null;
  craftQuantity: number;

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

// Weapon family — groups weapon tiers for UI display
export interface WeaponFamily {
  baseId: string;
  name: LocalizedString;
  weaponType: string;
  tiers: GameItem[];
}

// Loadout types — simplified, tier encoded in item ID
export interface LoadoutWeapon {
  id: string;
  mods: string[];
}

export interface LoadoutItem {
  id: string;
  quantity: number;
}

export interface Loadout {
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

// Resource calculation (updated for localized names)
export interface ResourceNode {
  id: string;
  name: LocalizedString;
  quantity: number;
  rarity: Rarity | null;
  imageUrl: string | null;
  canCraft: boolean;
  isExpanded: boolean;
  children: ResourceNode[];
}

export interface CalculatedResources {
  tree: ResourceNode[];
  flatList: { id: string; name: LocalizedString; quantity: number; rarity: Rarity | null }[];
}

// Raw RaidTheory item shape (for type-safe import processing)
export interface RawGameItem {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  type: string;
  rarity?: string;
  value?: number;
  weightKg?: number;
  stackSize?: number;
  isWeapon?: boolean;
  blueprintLocked?: boolean;
  effects?: Record<string, Record<string, string | number>>;
  craftBench?: string | string[];
  stationLevelRequired?: number;
  recipe?: Record<string, number>;
  craftQuantity?: number;
  recyclesInto?: Record<string, number>;
  salvagesInto?: Record<string, number>;
  upgradeCost?: Record<string, number>;
  upgradesTo?: string;
  repairCost?: Record<string, number>;
  repairDurability?: number;
  modSlots?: Record<string, string[]>;
  compatibleWith?: string[];
  vendors?: Array<{ cost: Record<string, number>; trader: string; limit?: number; refreshSeconds?: number }>;
  imageFilename?: string;
  updatedAt?: string;
  addedIn?: string;
  foundIn?: string;
  damageMitigation?: number;
  durability?: number;
  movementSpeedModifier?: number;
  shieldCharge?: number;
}
```

**Step 2: Verify types compile**

```bash
cd app && npx tsc --noEmit --skipLibCheck 2>&1 | head -20
```

Expected: Type errors in files that import old types (gameData.ts, components). This is expected — we'll fix them in subsequent tasks.

**Step 3: Commit**

```bash
git add app/src/types/index.ts
git commit -m "feat: rewrite types with single GameItem and i18n support"
```

---

### Task 3: Set Up i18n Infrastructure

**Files:**
- Create: `app/src/i18n.ts`
- Create: `app/src/locales/en.json`
- Create: `app/src/locales/zh-CN.json`

**Step 1: Create i18n configuration**

Create `app/src/i18n.ts`:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zhCN from './locales/zh-CN.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'zh-CN': { translation: zhCN },
  },
  lng: localStorage.getItem('locale') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
```

**Step 2: Create English locale file**

Create `app/src/locales/en.json` with all UI strings extracted from components. Use the component analysis to find every hardcoded string. Structure as flat keys grouped by component:

```json
{
  "app.title": "Arc Raiders Loadout Calculator",
  "app.subtitle": "Plan your loadout and calculate required resources",
  "app.reset": "Reset",
  "app.share": "Share",
  "app.copied": "Copied!",
  "app.footer.dataSource": "Game data from",
  "app.footer.bug": "Found a bug?",
  "app.footer.contribute": "Contribute on GitHub",
  "app.language": "EN",

  "loadout.title": "Loadout Builder",
  "loadout.primaryWeapon": "Primary Weapon",
  "loadout.secondaryWeapon": "Secondary Weapon",
  "loadout.augment": "Augment",
  "loadout.shield": "Shield",
  "loadout.shieldSelectAugment": "Shield (select augment first)",
  "loadout.noCompatibleShields": "No compatible shields",
  "loadout.consumables": "Consumables",
  "loadout.healing": "Healing Items",
  "loadout.grenades": "Grenades",
  "loadout.utilities": "Utilities",
  "loadout.traps": "Traps",
  "loadout.ammo": "Ammo",

  "weapon.select": "Select weapon...",
  "weapon.search": "Search weapons...",
  "weapon.noResults": "No weapons found",
  "weapon.tier": "Tier:",
  "weapon.ammo": "Ammo:",
  "weapon.modSlots": "Mod Slots:",
  "weapon.upgradeTiers": "Upgrade Tiers",
  "weapon.tierBonuses": "Tier {{tier}} Bonuses",
  "weapon.equippedMods": "Equipped Mods",
  "weapon.availableSlots": "Available Slots: {{count}}",
  "weapon.modifications": "Modifications",

  "mod.select": "Select {{slot}} Mod",
  "mod.clickToSelect": "Click to select",
  "mod.noMods": "No mods available for this slot",
  "mod.compatible": "Compatible: {{weapons}}",

  "resource.title": "Required Resources",
  "resource.stashCheck": "Stash Check",
  "resource.raidPrep": "Raid Prep",
  "resource.groupByItem": "Group by item",
  "resource.emptyState": "Select items in your loadout to see required resources",
  "resource.finalMaterials": "Final Materials Needed",
  "resource.clearAll": "Clear all",
  "resource.roundsPossible": "rounds possible",
  "resource.limitedBy": "Limited by: {{bottleneck}}",
  "resource.planLoadouts": "Plan for how many loadouts?",
  "resource.loadout": "loadout",
  "resource.loadouts": "loadouts",
  "resource.breakDown": "Click to break down into components",
  "resource.collapse": "Click to collapse",
  "resource.helpCrafting": "Click the hammer icon on any craftable material to break it down into its base components.",
  "resource.helpGroupBy": "Toggle to see resources grouped by each item in your loadout, or combined into a single list.",
  "resource.helpStash": "Enter your current inventory amounts in the input boxes below to see what you have and what you still need.",
  "resource.helpRaidPrep": "Enter how many loadouts you want to prepare to calculate total materials needed.",

  "selector.search": "Search...",
  "selector.select": "Select {{title}}...",
  "selector.noResults": "No items found",

  "stats.shieldCompatibility": "Shield Compatibility",
  "stats.backpackSlots": "Backpack Slots",
  "stats.safePocketSlots": "Safe Pocket Slots",
  "stats.quickUseSlots": "Quick Use Slots",
  "stats.weaponSlots": "Weapon Slots",
  "stats.weightLimit": "Weight Limit",
  "stats.shieldCharge": "Shield Charge",
  "stats.damageMitigation": "Damage Mitigation",
  "stats.movementPenalty": "Movement Penalty"
}
```

**Step 3: Create Chinese locale file**

Create `app/src/locales/zh-CN.json` with Chinese translations:

```json
{
  "app.title": "ARC Raiders 装备计算器",
  "app.subtitle": "规划你的装备并计算所需材料",
  "app.reset": "重置",
  "app.share": "分享",
  "app.copied": "已复制！",
  "app.footer.dataSource": "游戏数据来自",
  "app.footer.bug": "发现bug？",
  "app.footer.contribute": "在GitHub上贡献",
  "app.language": "中文",

  "loadout.title": "装备搭配",
  "loadout.primaryWeapon": "主武器",
  "loadout.secondaryWeapon": "副武器",
  "loadout.augment": "强化装置",
  "loadout.shield": "护盾",
  "loadout.shieldSelectAugment": "护盾（请先选择强化装置）",
  "loadout.noCompatibleShields": "没有兼容的护盾",
  "loadout.consumables": "消耗品",
  "loadout.healing": "治疗物品",
  "loadout.grenades": "手雷",
  "loadout.utilities": "工具",
  "loadout.traps": "陷阱",
  "loadout.ammo": "弹药",

  "weapon.select": "选择武器...",
  "weapon.search": "搜索武器...",
  "weapon.noResults": "未找到武器",
  "weapon.tier": "等级：",
  "weapon.ammo": "弹药：",
  "weapon.modSlots": "改装槽：",
  "weapon.upgradeTiers": "升级等级",
  "weapon.tierBonuses": "{{tier}}级加成",
  "weapon.equippedMods": "已装备改装",
  "weapon.availableSlots": "可用槽位：{{count}}",
  "weapon.modifications": "改装",

  "mod.select": "选择{{slot}}改装",
  "mod.clickToSelect": "点击选择",
  "mod.noMods": "该槽位没有可用改装",
  "mod.compatible": "兼容：{{weapons}}",

  "resource.title": "所需资源",
  "resource.stashCheck": "库存检查",
  "resource.raidPrep": "出击准备",
  "resource.groupByItem": "按物品分组",
  "resource.emptyState": "在装备搭配中选择物品以查看所需资源",
  "resource.finalMaterials": "最终所需材料",
  "resource.clearAll": "清除全部",
  "resource.roundsPossible": "可制作次数",
  "resource.limitedBy": "受限于：{{bottleneck}}",
  "resource.planLoadouts": "计划制作几套装备？",
  "resource.loadout": "套装备",
  "resource.loadouts": "套装备",
  "resource.breakDown": "点击分解为基础组件",
  "resource.collapse": "点击折叠",
  "resource.helpCrafting": "点击锤子图标可将可制作材料分解为基础组件。",
  "resource.helpGroupBy": "切换以按装备中的各物品分组查看资源，或合并为一个列表。",
  "resource.helpStash": "在下方输入框中输入你当前的库存数量，查看已有和仍需的材料。",
  "resource.helpRaidPrep": "输入你想准备的装备套数来计算所需材料总量。",

  "selector.search": "搜索...",
  "selector.select": "选择{{title}}...",
  "selector.noResults": "未找到物品",

  "stats.shieldCompatibility": "护盾兼容性",
  "stats.backpackSlots": "背包槽位",
  "stats.safePocketSlots": "安全口袋槽位",
  "stats.quickUseSlots": "快速使用槽位",
  "stats.weaponSlots": "武器槽位",
  "stats.weightLimit": "重量限制",
  "stats.shieldCharge": "护盾充能",
  "stats.damageMitigation": "伤害减免",
  "stats.movementPenalty": "移动惩罚"
}
```

**Step 4: Commit**

```bash
git add app/src/i18n.ts app/src/locales/
git commit -m "feat: add i18n infrastructure with English and Chinese locale files"
```

---

### Task 4: Vite Plugin for Data Loading

**Files:**
- Rewrite: `app/vite.config.ts`
- Create: `app/src/vite-env.d.ts` (or modify if exists — add virtual module type declarations)

**Step 1: Create Vite plugin to load arcraiders-data at build time**

Rewrite `app/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function arcRaidersDataPlugin() {
  const itemsModuleId = 'virtual:arcraiders-items';
  const resolvedItemsId = '\0' + itemsModuleId;
  const hideoutModuleId = 'virtual:arcraiders-hideout';
  const resolvedHideoutId = '\0' + hideoutModuleId;

  return {
    name: 'arcraiders-data',
    resolveId(id: string) {
      if (id === itemsModuleId) return resolvedItemsId;
      if (id === hideoutModuleId) return resolvedHideoutId;
    },
    load(id: string) {
      if (id === resolvedItemsId) {
        const itemsDir = path.resolve(__dirname, 'node_modules/arcraiders-data/items');
        const files = fs.readdirSync(itemsDir).filter(f => f.endsWith('.json'));
        const items = files.map(f => JSON.parse(fs.readFileSync(path.join(itemsDir, f), 'utf-8')));
        return `export default ${JSON.stringify(items)};`;
      }
      if (id === resolvedHideoutId) {
        const hideoutDir = path.resolve(__dirname, 'node_modules/arcraiders-data/hideout');
        const files = fs.readdirSync(hideoutDir).filter(f => f.endsWith('.json'));
        const data: Record<string, unknown> = {};
        for (const f of files) {
          const parsed = JSON.parse(fs.readFileSync(path.join(hideoutDir, f), 'utf-8'));
          data[parsed.id] = parsed;
        }
        return `export default ${JSON.stringify(data)};`;
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), arcRaidersDataPlugin()],
});
```

**Step 2: Add TypeScript declarations for virtual modules**

Check if `app/src/vite-env.d.ts` exists. If it does, append to it. If not, create it:

```typescript
/// <reference types="vite/client" />

declare module 'virtual:arcraiders-items' {
  import type { RawGameItem } from './types';
  const items: RawGameItem[];
  export default items;
}

declare module 'virtual:arcraiders-hideout' {
  const hideout: Record<string, unknown>;
  export default hideout;
}
```

**Step 3: Verify the Vite plugin works**

```bash
cd app && npx vite build 2>&1 | tail -5
```

Expected: Build may fail due to component type errors (expected at this stage), but should NOT fail on virtual module resolution. If you see errors about `virtual:arcraiders-items` not found, debug the plugin.

**Step 4: Commit**

```bash
git add app/vite.config.ts app/src/vite-env.d.ts
git commit -m "feat: add Vite plugin to load arcraiders-data at build time"
```

---

### Task 5: Rewrite gameData.ts

**Files:**
- Rewrite: `app/src/data/gameData.ts`
- Delete: `app/src/data/game_data.json`

This is the most critical task — the entire data access layer.

**Step 1: Write the new gameData.ts**

The module must:
1. Import raw items from the virtual module
2. Process each raw item into a `GameItem` (extract localized strings, classify category)
3. Build indexes (by ID, by category)
4. Group weapons into `WeaponFamily` objects
5. Export query functions that components use

```typescript
import type { GameItem, RawGameItem, WeaponFamily, Rarity, ItemCategory, Locale, LocalizedString, ItemEffect } from '../types';
import rawItems from 'virtual:arcraiders-items';

// --- Supported locales ---
const SUPPORTED_LOCALES: Locale[] = ['en', 'zh-CN'];

// --- Processing helpers ---

function extractLocalizedString(raw: Record<string, string>): LocalizedString {
  return {
    en: raw['en'] ?? '',
    'zh-CN': raw['zh-CN'] ?? raw['en'] ?? '',
  };
}

function extractEffects(
  raw: Record<string, Record<string, string | number>> | undefined
): Record<string, ItemEffect> {
  if (!raw) return {};
  const result: Record<string, ItemEffect> = {};
  for (const [key, effectData] of Object.entries(raw)) {
    result[key] = {
      value: effectData['value'] ?? '',
      label: {
        en: (effectData['en'] as string) ?? key,
        'zh-CN': (effectData['zh-CN'] as string) ?? (effectData['en'] as string) ?? key,
      },
    };
  }
  return result;
}

function classifyCategory(raw: RawGameItem): ItemCategory {
  if (raw.isWeapon) return 'weapon';
  if (raw.type === 'Augment') return 'augment';
  if (raw.type === 'Shield') return 'shield';
  if (raw.type === 'Modification') return 'modification';
  if (raw.type === 'Ammunition') return 'ammunition';
  if (raw.type === 'Quick Use') {
    if (raw.effects && 'Healing' in raw.effects) return 'healing';
    if (raw.id.includes('_trap') || raw.id.includes('_mine')) return 'trap';
    if (raw.effects && 'Damage' in raw.effects) return 'grenade';
    return 'utility';
  }
  return 'material';
}

const VALID_RARITIES = new Set(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']);

function parseRarity(raw: string | undefined): Rarity | null {
  if (!raw || !VALID_RARITIES.has(raw)) return null;
  return raw as Rarity;
}

function processRawItem(raw: RawGameItem): GameItem {
  return {
    id: raw.id,
    name: extractLocalizedString(raw.name),
    description: extractLocalizedString(raw.description),
    type: raw.type,
    category: classifyCategory(raw),
    rarity: parseRarity(raw.rarity),
    value: raw.value ?? 0,
    weightKg: raw.weightKg ?? 0,
    stackSize: raw.stackSize ?? 1,
    imageUrl: raw.imageFilename ?? null,
    effects: extractEffects(raw.effects),
    recipe: raw.recipe ?? null,
    craftBench: raw.craftBench ?? null,
    stationLevelRequired: raw.stationLevelRequired ?? null,
    craftQuantity: raw.craftQuantity ?? 1,
    isWeapon: raw.isWeapon ?? false,
    modSlots: raw.modSlots ?? null,
    upgradeCost: raw.upgradeCost ?? null,
    upgradesTo: raw.upgradesTo ?? null,
    repairCost: raw.repairCost ?? null,
    repairDurability: raw.repairDurability ?? null,
    compatibleWith: raw.compatibleWith ?? null,
    blueprintLocked: raw.blueprintLocked ?? false,
    recyclesInto: raw.recyclesInto ?? null,
    salvagesInto: raw.salvagesInto ?? null,
    vendors: raw.vendors ?? null,
    updatedAt: raw.updatedAt ?? null,
    addedIn: raw.addedIn ?? null,
  };
}

// --- Process all items ---
const allItems: GameItem[] = rawItems.map(processRawItem);
const itemIndex = new Map<string, GameItem>(allItems.map(item => [item.id, item]));

// --- Category-filtered lists (computed once) ---
const weapons = allItems.filter(i => i.category === 'weapon');
const augments = allItems.filter(i => i.category === 'augment');
const shields = allItems.filter(i => i.category === 'shield');
const modifications = allItems.filter(i => i.category === 'modification');
const healing = allItems.filter(i => i.category === 'healing');
const grenades = allItems.filter(i => i.category === 'grenade');
const traps = allItems.filter(i => i.category === 'trap');
const utilities = allItems.filter(i => i.category === 'utility');
const ammunition = allItems.filter(i => i.category === 'ammunition');
const materials = allItems.filter(i => i.category === 'material');

// --- Weapon families ---
// Group weapon tiers by following upgradesTo chains.
// Find root weapons (those that no other weapon upgrades to).

function buildWeaponFamilies(): WeaponFamily[] {
  const upgradeTargets = new Set(weapons.filter(w => w.upgradesTo).map(w => w.upgradesTo!));
  const roots = weapons.filter(w => !upgradeTargets.has(w.id));

  return roots.map(root => {
    const tiers: GameItem[] = [root];
    let current = root;
    while (current.upgradesTo) {
      const next = itemIndex.get(current.upgradesTo);
      if (!next) break;
      tiers.push(next);
      current = next;
    }

    // Base ID: strip tier suffix (e.g., "anvil_i" -> "anvil")
    const baseId = root.id.replace(/_[ivx]+$/i, '');

    // Base name: use the root name but strip the tier suffix from display
    const baseName: LocalizedString = {
      en: root.name.en.replace(/\s+[IVX]+$/i, ''),
      'zh-CN': root.name['zh-CN'].replace(/\s+[IVX]+$/i, ''),
    };

    return {
      baseId,
      name: baseName,
      weaponType: root.type,
      tiers,
    };
  });
}

const weaponFamilies = buildWeaponFamilies();

// --- Public API ---

// All items
export function getAllItems(): GameItem[] { return allItems; }
export function getItemById(id: string): GameItem | undefined { return itemIndex.get(id); }

// Category accessors
export function getWeapons(): GameItem[] { return weapons; }
export function getAugments(): GameItem[] { return augments; }
export function getShields(): GameItem[] { return shields; }
export function getModifications(): GameItem[] { return modifications; }
export function getHealing(): GameItem[] { return healing; }
export function getGrenades(): GameItem[] { return grenades; }
export function getTraps(): GameItem[] { return traps; }
export function getUtilities(): GameItem[] { return utilities; }
export function getAmmunition(): GameItem[] { return ammunition; }
export function getMaterials(): GameItem[] { return materials; }

// Weapon families
export function getWeaponFamilies(): WeaponFamily[] { return weaponFamilies; }

export function getWeaponFamilyByBaseId(baseId: string): WeaponFamily | undefined {
  return weaponFamilies.find(f => f.baseId === baseId);
}

// Get unique weapon types (e.g., "Assault Rifle", "Hand Cannon")
export function getWeaponTypes(): string[] {
  const types = new Set(weaponFamilies.map(f => f.weaponType));
  return Array.from(types).sort();
}

// Shields compatible with a given augment's Shield Compatibility effect
export function getShieldsForAugment(augmentId: string | null): GameItem[] {
  if (!augmentId) return [];
  const augment = itemIndex.get(augmentId);
  if (!augment) return [];

  const shieldCompat = augment.effects['Shield Compatibility'];
  if (!shieldCompat) return [];

  const compatValue = String(shieldCompat.value);
  const compatTypes = compatValue.split(',').map(s => s.trim().toLowerCase());

  return shields.filter(shield => {
    const shieldType = shield.name.en.toLowerCase().replace(' shield', '');
    return compatTypes.includes(shieldType);
  });
}

// Check if an item has a crafting recipe
export function isCraftable(itemId: string): boolean {
  const item = itemIndex.get(itemId);
  return item !== undefined && item.recipe !== null && Object.keys(item.recipe).length > 0;
}

// Get recipe for an item (returns {ingredients, outputQuantity})
export function getItemRecipe(itemId: string): { ingredients: Record<string, number>; outputQuantity: number } | null {
  const item = itemIndex.get(itemId);
  if (!item || !item.recipe || Object.keys(item.recipe).length === 0) return null;
  return {
    ingredients: item.recipe,
    outputQuantity: item.craftQuantity,
  };
}

// Rarity color (unchanged)
export function getRarityColor(rarity: string | null): string {
  switch (rarity?.toLowerCase()) {
    case 'common': return '#9ca3af';
    case 'uncommon': return '#22c55e';
    case 'rare': return '#3b82f6';
    case 'epic': return '#a855f7';
    case 'legendary': return '#f59e0b';
    default: return '#9ca3af';
  }
}

// Items that have a recipe (for filtering craftable consumables)
export function getCraftableItems(category: ItemCategory): GameItem[] {
  return allItems.filter(i => i.category === category && i.recipe && Object.keys(i.recipe).length > 0);
}
```

**Step 2: Delete old game_data.json**

```bash
rm app/src/data/game_data.json
```

**Step 3: Verify gameData.ts compiles**

```bash
cd app && npx tsc --noEmit --skipLibCheck 2>&1 | head -30
```

Expected: Errors only in components that still use old types/functions. gameData.ts itself should compile cleanly.

**Step 4: Commit**

```bash
git add app/src/data/gameData.ts
git rm app/src/data/game_data.json
git commit -m "feat: rewrite gameData.ts to load from arcraiders-data package"
```

---

### Task 6: Update shareLoadout.ts

**Files:**
- Rewrite: `app/src/utils/shareLoadout.ts`

**Step 1: Rewrite share encoding/decoding**

Key changes:
- `LoadoutWeapon` no longer has `tier` — the tier is part of the item ID (e.g., `"kettle_ii"`)
- Drop legacy base64 decoding (old URLs are incompatible anyway)
- The compact format changes: `w1: { i: "kettle_ii", m: [...] }` instead of `{ i: "kettle", t: 2, m: [...] }`

```typescript
import LZString from 'lz-string';
import type { Loadout, LoadoutWeapon, LoadoutItem } from '../types';

interface CompactLoadout {
  w1?: { i: string; m: string[] } | null;
  w2?: { i: string; m: string[] } | null;
  a?: string | null;
  s?: string | null;
  h?: { i: string; q: number }[];
  u?: { i: string; q: number }[];
  g?: { i: string; q: number }[];
  t?: { i: string; q: number }[];
  am?: { t: string; q: number }[];
}

function compactWeapon(w: LoadoutWeapon | null): { i: string; m: string[] } | null {
  if (!w) return null;
  return { i: w.id, m: w.mods.filter(Boolean) };
}

function expandWeapon(w: { i: string; m: string[] } | null | undefined): LoadoutWeapon | null {
  if (!w) return null;
  return { id: w.i, mods: w.m || [] };
}

function compactItems(items: LoadoutItem[]): { i: string; q: number }[] {
  return items.filter(item => item.quantity > 0).map(item => ({ i: item.id, q: item.quantity }));
}

function expandItems(items: { i: string; q: number }[] | undefined): LoadoutItem[] {
  if (!items) return [];
  return items.map(item => ({ id: item.i, quantity: item.q }));
}

export function encodeLoadout(loadout: Loadout): string {
  const compact: CompactLoadout = {
    w1: compactWeapon(loadout.weapon1),
    w2: compactWeapon(loadout.weapon2),
    a: loadout.augment,
    s: loadout.shield,
    h: compactItems(loadout.healing),
    u: compactItems(loadout.utilities),
    g: compactItems(loadout.grenades),
    t: compactItems(loadout.traps),
    am: loadout.ammo.filter(a => a.quantity > 0).map(a => ({ t: a.type, q: a.quantity })),
  };

  const json = JSON.stringify(compact);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeLoadout(encoded: string): Loadout | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;

    const compact = JSON.parse(json) as CompactLoadout;

    return {
      weapon1: expandWeapon(compact.w1),
      weapon2: expandWeapon(compact.w2),
      augment: compact.a ?? null,
      shield: compact.s ?? null,
      healing: expandItems(compact.h),
      utilities: expandItems(compact.u),
      grenades: expandItems(compact.g),
      traps: expandItems(compact.t),
      ammo: (compact.am || []).map(a => ({ type: a.t, quantity: a.q })),
    };
  } catch {
    return null;
  }
}

export function getShareUrl(loadout: Loadout): string {
  const encoded = encodeLoadout(loadout);
  const url = new URL(window.location.href);
  url.searchParams.set('share', encoded);
  return url.toString();
}

export function getSharedLoadout(): Loadout | null {
  const url = new URL(window.location.href);
  const encoded = url.searchParams.get('share');
  if (!encoded) return null;

  const loadout = decodeLoadout(encoded);
  if (loadout) {
    // Clean URL after restoring
    url.searchParams.delete('share');
    window.history.replaceState({}, '', url.toString());
  }
  return loadout;
}
```

**Step 2: Commit**

```bash
git add app/src/utils/shareLoadout.ts
git commit -m "feat: rewrite shareLoadout for new item ID format (no separate tier)"
```

---

### Task 7: Update App.tsx

**Files:**
- Modify: `app/src/App.tsx`
- Modify: `app/src/main.tsx` (add i18n import)

**Step 1: Add i18n import to main.tsx**

Add `import './i18n';` as the first import in `app/src/main.tsx` (before React imports). This initializes i18n before the app renders.

**Step 2: Update App.tsx**

Key changes:
- Import and use `useTranslation` from `react-i18next`
- Replace all hardcoded strings with `t('key')` calls
- Add language toggle button in the header
- Update footer attribution to link to RaidTheory/arctracker.io
- `Loadout` type no longer has `tier` in weapons (already handled by new type)

The language toggle:
```tsx
const { t, i18n } = useTranslation();
const toggleLanguage = () => {
  const newLang = i18n.language === 'en' ? 'zh-CN' : 'en';
  i18n.changeLanguage(newLang);
  localStorage.setItem('locale', newLang);
};
```

Add toggle button in the header area:
```tsx
<button onClick={toggleLanguage} className="text-sm px-2 py-1 rounded border border-zinc-600 hover:bg-zinc-700">
  {i18n.language === 'en' ? '中文' : 'EN'}
</button>
```

Update footer:
```tsx
<footer>
  {t('app.footer.dataSource')}{' '}
  <a href="https://github.com/RaidTheory/arcraiders-data">RaidTheory/arcraiders-data</a>
  {' & '}
  <a href="https://arctracker.io">arctracker.io</a>
</footer>
```

**Step 3: Commit**

```bash
git add app/src/main.tsx app/src/App.tsx
git commit -m "feat: add i18n provider, language toggle, and RaidTheory attribution"
```

---

### Task 8: Update UI Components (ItemCard, ItemSelector)

**Files:**
- Modify: `app/src/components/ui/ItemCard.tsx`
- Modify: `app/src/components/ui/ItemSelector.tsx`

**Step 1: Update ItemCard.tsx**

ItemCard is a generic component. Key change: the `name` prop should accept `string` (the component receives already-resolved localized names from parent). Check the current props interface and verify — if it already takes `name: string`, minimal changes needed. The parent components will pass `item.name[locale]` or `item.name[i18n.language as Locale]`.

If the component directly accesses `item.name` as a string anywhere, update to accept the resolved string.

**Step 2: Update ItemSelector.tsx**

- Import `useTranslation` for placeholder/empty state strings
- Replace hardcoded "Search...", "No items found" with `t()` calls
- Items passed to the selector should already have resolved names from the parent

**Step 3: Commit**

```bash
git add app/src/components/ui/ItemCard.tsx app/src/components/ui/ItemSelector.tsx
git commit -m "feat: add i18n support to ItemCard and ItemSelector"
```

---

### Task 9: Update ModSelector

**Files:**
- Modify: `app/src/components/LoadoutBuilder/ModSelector.tsx`

**Step 1: Update ModSelector**

Key changes:
- Import `GameItem` instead of `Modification`
- Import `useTranslation` for UI strings
- Replace `getModificationsForWeaponSlot(weaponName, slotType)` — this function is removed. Instead, the parent (`WeaponSelector`) now passes compatible mod IDs from the weapon's `modSlots` field. ModSelector looks them up with `getItemById()`.
- Replace `m.slot_type` with checking mod's slot from weapon's `modSlots` keys
- Replace `m.name` string access with `item.name[locale]`
- Replace `m.stats.effects` with `item.effects` (iterate over `Object.entries(item.effects)` and display `effect.label[locale]: effect.value`)
- Replace `m.compatible_weapons` with `item.compatibleWith`
- Replace hardcoded strings with `t()` calls

**Important pattern change for mod selection:**

Old approach: `getModificationsForWeaponSlot(weaponName, slotType)` searched all mods for slot_type match + weapon compatibility.

New approach: The weapon's `modSlots` field already contains `{ muzzle: ["compensator_i", "compensator_ii", ...], stock: [...] }`. The parent passes the mod ID list for the slot. ModSelector just calls `getItemById(modId)` for each.

```typescript
// Old
const mods = getModificationsForWeaponSlot(weaponName, slotType);

// New — parent passes modIds from weapon.modSlots[slotKey]
const mods = modIds.map(id => getItemById(id)).filter(Boolean) as GameItem[];
```

**Step 2: Commit**

```bash
git add app/src/components/LoadoutBuilder/ModSelector.tsx
git commit -m "feat: update ModSelector for GameItem type and i18n"
```

---

### Task 10: Update WeaponSelector

**Files:**
- Modify: `app/src/components/LoadoutBuilder/WeaponSelector.tsx`

**Step 1: Update WeaponSelector**

Key changes:
- Import `GameItem`, `WeaponFamily`, `LoadoutWeapon`, `Locale` instead of `Weapon`, `Modification`
- Import `useTranslation` for UI strings
- Import `getWeaponFamilies`, `getWeaponTypes`, `getItemById` instead of `getWeapons`, `getWeaponById`, `getModificationById`
- Replace `getWeapons()` with `getWeaponFamilies()` for the dropdown list
- Group by `family.weaponType` instead of `weapon.category`
- Display `family.name[locale]` in the list
- Tier selection: instead of `tier: number` on the loadout weapon, select among `family.tiers` — each tier is a separate `GameItem`. The selected weapon ID is the tier's ID (e.g., `"anvil_ii"`)
- Tier picker shows `family.tiers.length` options (Tier 1, 2, 3, 4 corresponding to index 0, 1, 2, 3)
- Mod slots come from the selected tier's `modSlots` field: `Object.entries(selectedWeapon.modSlots)` gives `[slotType, modIds[]]`
- Pass `modIds` array to `ModSelector` instead of `slotType` string
- Search filter: filter on `family.name[locale]`
- Tooltip: show weapon effects via `Object.entries(selectedWeapon.effects)`, display upgrade bonuses by comparing effects between tiers
- Replace `weapon.ammo_type` with `selectedWeapon.effects['Ammo Type']?.value`
- Replace all hardcoded strings with `t()` calls

**Tier selection mapping:**

```typescript
// Old
const [tier, setTier] = useState(loadoutWeapon?.tier ?? 1);
// weapon stays the same, tier changes

// New
const family = getWeaponFamilyByBaseId(baseId);
const tierIndex = family.tiers.findIndex(t => t.id === loadoutWeapon?.id) ?? 0;
// Changing tier means changing the weapon ID entirely
onSelect({ id: family.tiers[newTierIndex].id, mods: currentMods });
```

**Step 2: Commit**

```bash
git add app/src/components/LoadoutBuilder/WeaponSelector.tsx
git commit -m "feat: update WeaponSelector for WeaponFamily grouping and i18n"
```

---

### Task 11: Update LoadoutBuilder

**Files:**
- Modify: `app/src/components/LoadoutBuilder/LoadoutBuilder.tsx`

**Step 1: Update LoadoutBuilder**

Key changes:
- Import `GameItem`, `Locale` instead of `EquipmentItem`, `LoadoutItem`
- Import `useTranslation` for UI strings
- Replace type-specific getters with category-based:
  - `getAugments()` → stays the same (returns `GameItem[]` now)
  - `getShieldsForAugment()` → stays the same signature
  - `getHealing()` → stays the same
  - `getGrenades()` → stays the same
  - `getQuickUse()` → `getUtilities()`
  - `getTraps()` → stays the same
  - `getAmmo()` → `getAmmunition()`
- Replace `getAugmentById()` / `getEquipmentById()` → `getItemById()`
- Filter craftable items: instead of checking `item.crafting.materials.length > 0`, use `getCraftableItems(category)` or check `item.recipe && Object.keys(item.recipe).length > 0`
- Display names: `item.name[locale]` instead of `item.name`
- Augment stats: `item.effects['Shield Compatibility']?.value` instead of `item.stats['Shield Compatibility']`
- Replace `item.stats` usage with `item.effects` — each effect has `.value` and `.label[locale]`
- Replace all hardcoded strings with `t()` calls
- Consumable sections use `t('loadout.healing')`, `t('loadout.grenades')`, etc.

**Step 2: Commit**

```bash
git add app/src/components/LoadoutBuilder/LoadoutBuilder.tsx
git commit -m "feat: update LoadoutBuilder for GameItem type and i18n"
```

---

### Task 12: Update ResourceTree

**Files:**
- Modify: `app/src/components/Calculator/ResourceTree.tsx`

This is the largest component (966 lines). Key changes:

**Step 1: Update imports and type references**

- Import `GameItem`, `Loadout`, `Locale`, `ResourceNode` instead of old types
- Import `useTranslation`
- Import `getItemById`, `getItemRecipe`, `isCraftable`, `getRarityColor` instead of old functions
- Remove imports of `CraftingMaterial`, `getWeaponById`, `getEquipmentById`, `getModificationById`, `getMaterialByName`, `getAmmoByName`, `getMaterialRecipe`

**Step 2: Update resource calculation logic**

The core algorithm builds a tree of required materials. The transformation:

Old pattern (name-based):
```typescript
// Old: materials is CraftingMaterial[] = [{material: "Metal Parts", quantity: 5}]
for (const mat of weapon.crafting.materials) {
  const materialInfo = getMaterialByName(mat.material);
  // uses mat.material as display name
}
```

New pattern (ID-based):
```typescript
// New: recipe is Record<string, number> = {metal_parts: 5, rubber_parts: 8}
const weapon = getItemById(weaponId);
if (weapon?.recipe) {
  for (const [ingredientId, quantity] of Object.entries(weapon.recipe)) {
    const ingredientItem = getItemById(ingredientId);
    // uses ingredientItem.name[locale] for display
  }
}
```

**Step 3: Update upgrade cost handling**

Old: `weapon.crafting.upgrades[tierIndex].materials` gave the upgrade recipe.
New: Each tier is a separate item. The `upgradeCost` field on the tier item gives the cost to upgrade TO that tier. For the resource tree, include both the base weapon's `recipe` AND the selected tier's `upgradeCost`.

```typescript
// For a selected weapon "anvil_ii":
const weapon = getItemById("anvil_ii");
// Base craft cost: look at the tier 1 weapon's recipe
// Upgrade cost: weapon.upgradeCost (cost to upgrade from previous tier)
// Total for selected tier: sum recipe of tier 1 + upgradeCosts of each intermediate tier
```

Actually, to calculate total cost for a weapon at a given tier, walk the chain backwards:
```typescript
function getWeaponTotalCost(weaponId: string): Record<string, number> {
  const costs: Record<string, number> = {};
  // Walk backwards through the upgrade chain to find the base weapon
  const chain: GameItem[] = [];
  let current = getItemById(weaponId);
  while (current) {
    chain.unshift(current);
    // Find the weapon that upgradesTo this one
    const prev = getWeapons().find(w => w.upgradesTo === current!.id);
    current = prev ?? undefined;
  }
  // Base weapon recipe
  if (chain[0].recipe) {
    for (const [id, qty] of Object.entries(chain[0].recipe)) {
      costs[id] = (costs[id] ?? 0) + qty;
    }
  }
  // Add upgrade costs for each subsequent tier
  for (let i = 1; i < chain.length; i++) {
    if (chain[i].upgradeCost) {
      for (const [id, qty] of Object.entries(chain[i].upgradeCost!)) {
        costs[id] = (costs[id] ?? 0) + qty;
      }
    }
  }
  return costs;
}
```

**Step 4: Update mod cost handling**

Old: `getModificationById(modId)?.crafting.materials`
New: `getItemById(modId)?.recipe`

**Step 5: Update equipment cost handling**

Old: `getEquipmentById(id)?.crafting.materials`
New: `getItemById(id)?.recipe`

**Step 6: Update material breakdown (craftable sub-materials)**

Old: `getMaterialRecipe(materialName)` → `{materials, outputQuantity}`
New: `getItemRecipe(materialId)` → `{ingredients, outputQuantity}`

**Step 7: Update ResourceNode creation**

Old:
```typescript
{ id, name: "Metal Parts", quantity, rarity, image: materialInfo?.image, canCraft, isExpanded, children }
```
New:
```typescript
{ id, name: item.name, quantity, rarity, imageUrl: item.imageUrl, canCraft, isExpanded, children }
```

Note: `ResourceNode.name` is now `LocalizedString`, so display in JSX uses `node.name[locale]`.

**Step 8: Update all JSX to use localized strings**

- Replace all hardcoded strings with `t()` calls
- Display `node.name[locale]` instead of `node.name` for material names
- Display `item.name[locale]` for item names in per-item breakdown headers

**Step 9: Commit**

```bash
git add app/src/components/Calculator/ResourceTree.tsx
git commit -m "feat: update ResourceTree for ID-based recipes and i18n"
```

---

### Task 13: Delete Old Scraper Files

**Files:**
- Delete: `scraper/` directory (all files)
- Delete: `data/` directory
- Keep: `docs/plans/` design docs

**Step 1: Remove scraper and data directories**

```bash
cd /home/ruiwen/repo/arc-raiders-loadout-calculator
git rm -r scraper/
git rm -r data/
```

**Step 2: Commit**

```bash
git commit -m "chore: remove custom scrapers and old data directory

Replaced by arcraiders-data npm package. See docs/plans/2026-03-19-raidtheory-data-migration-design.md"
```

---

### Task 14: Build, Lint, and Fix

**Files:** Any files with remaining type errors or lint issues.

**Step 1: Run TypeScript check**

```bash
cd app && npx tsc --noEmit
```

Fix any type errors. Common issues:
- Components accessing `.name` as string instead of `LocalizedString`
- Missing locale resolution (`item.name` → `item.name[locale]`)
- Old function calls that were renamed or removed

**Step 2: Run lint**

```bash
cd app && npm run lint
```

Fix any lint errors (unused imports from old types, etc.).

**Step 3: Run build**

```bash
cd app && npm run build
```

Expected: Clean build with no errors.

**Step 4: Manual test**

```bash
cd app && npm run dev
```

Verify in browser:
- Weapons load and display correctly
- Weapon tier selection works
- Mod selection works
- Augment → shield compatibility works
- Consumables (healing, grenades, traps, utilities) display and select
- Resource tree calculates correctly
- Material breakdown (hammer icon) works
- Stash Check and Raid Prep tabs work
- Language toggle switches between EN and 中文
- Share URL encodes and decodes correctly
- All item names display in selected language

**Step 5: Commit fixes**

```bash
git add -A
git commit -m "fix: resolve type errors and lint issues from data migration"
```

---

### Task 15: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update project documentation**

Update the following sections:
- **Project Structure**: Remove `scraper/` and `data/` entries. Add `app/src/locales/` and `app/src/i18n.ts`.
- **Key Commands**: Remove scraper commands. Add note about `npm install` pulling arcraiders-data.
- **Architecture > Data Pipeline**: Replace scraper description with: "Game data sourced from `arcraiders-data` npm package (RaidTheory/arcraiders-data). Loaded at build time via Vite virtual module plugin. No custom scrapers."
- **Architecture > Key Components**: Update type references (e.g., `GameItem` instead of `Weapon`/`EquipmentItem`).
- **Code Patterns > Loadout State**: Update to show new `LoadoutWeapon` without `tier` field.
- **Scraper Details section**: Remove entirely.
- **Data Notes**: Update to reflect new data source.
- Add **i18n** section explaining locale structure and how to add UI strings.
- Add **Attribution** section for RaidTheory.

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for arcraiders-data migration and i18n"
```

---

## Task Dependency Graph

```
Task 1 (install deps)
  ↓
Task 2 (types) ←──────────────────────┐
  ↓                                    │
Task 3 (i18n setup)                    │ All later tasks
  ↓                                    │ depend on types
Task 4 (Vite plugin)                   │
  ↓                                    │
Task 5 (gameData.ts) ─────────────────→│
  ↓                                    │
Task 6 (shareLoadout) ←── can parallel │
  │                                    │
Task 7 (App.tsx) ←──── can parallel    │
  │                                    │
Task 8 (ItemCard/Selector) ← parallel  │
  │                                    │
Task 9 (ModSelector)                   │
  ↓                                    │
Task 10 (WeaponSelector)               │
  ↓                                    │
Task 11 (LoadoutBuilder)               │
  ↓                                    │
Task 12 (ResourceTree)                 │
  ↓                                    │
Task 13 (delete scrapers)              │
  ↓                                    │
Task 14 (build + fix)                  │
  ↓                                    │
Task 15 (update CLAUDE.md) ────────────┘
```

Tasks 6, 7, 8 can be done in parallel after Task 5.
Tasks 9-12 are sequential (ModSelector → WeaponSelector → LoadoutBuilder → ResourceTree) because each builds on patterns established in the previous.
