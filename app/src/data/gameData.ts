import type { GameItem, RawGameItem, WeaponFamily, Rarity, ItemCategory, LocalizedString, ItemEffect, Vendor } from '../types';
import rawItems from 'virtual:arcraiders-items';

// --- Processing helpers ---

function extractLocalizedString(raw: Record<string, string> | undefined): LocalizedString {
  if (!raw) return { en: '', 'zh-CN': '' };
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
    if (!effectData) continue;
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

const WEAPON_TYPE_FALLBACK = new Set([
  'Assault Rifle',
  'Battle Rifle',
  'SMG',
  'Pistol',
  'Hand Cannon',
  'Shotgun',
  'Sniper Rifle',
  'LMG',
  'Special',
]);

function isLikelyWeapon(raw: RawGameItem): boolean {
  if (raw.isWeapon) return true;
  // Some source records can miss isWeapon for newly added guns.
  return WEAPON_TYPE_FALLBACK.has(raw.type);
}

function classifyCategory(raw: RawGameItem): ItemCategory {
  if (isLikelyWeapon(raw)) return 'weapon';
  if (raw.type === 'Augment') return 'augment';
  if (raw.type === 'Shield') return 'shield';
  if (raw.type === 'Modification') return 'modification';
  if (raw.type === 'Ammunition') return 'ammunition';
  if (raw.type === 'Quick Use') {
    if (raw.effects && ('Healing' in raw.effects || 'Recharge' in raw.effects)) return 'healing';
    if (raw.id.includes('_trap') || raw.id.includes('_mine') || raw.id === 'deadline') return 'trap';
    if (raw.id.includes('grenade') || raw.id.includes('showstopper')) return 'grenade';
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
    imageUrl: raw.imageFilename ?? undefined,
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
    foundIn: raw.foundIn ?? undefined,
  };
}

function getWeaponBaseId(itemId: string): string {
  return itemId.replace(/_[ivx]+$/i, '');
}

// --- Process all items ---
const allItems: GameItem[] = rawItems.map(processRawItem);
const itemIndex = new Map<string, GameItem>(allItems.map(item => [item.id, item]));

// --- Reverse recycle/salvage indexes ---
interface ObtainSource {
  itemId: string;
  quantity: number;
}

const recycleSourcesMap = new Map<string, ObtainSource[]>();
const salvageSourcesMap = new Map<string, ObtainSource[]>();

for (const item of allItems) {
  if (item.recyclesInto) {
    for (const [materialId, qty] of Object.entries(item.recyclesInto)) {
      if (!recycleSourcesMap.has(materialId)) recycleSourcesMap.set(materialId, []);
      recycleSourcesMap.get(materialId)!.push({ itemId: item.id, quantity: qty });
    }
  }
  if (item.salvagesInto) {
    for (const [materialId, qty] of Object.entries(item.salvagesInto)) {
      if (!salvageSourcesMap.has(materialId)) salvageSourcesMap.set(materialId, []);
      salvageSourcesMap.get(materialId)!.push({ itemId: item.id, quantity: qty });
    }
  }
}

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
const ROMAN_TIER_ORDER: Record<string, number> = {
  i: 1,
  ii: 2,
  iii: 3,
  iv: 4,
  v: 5,
  vi: 6,
  vii: 7,
  viii: 8,
  ix: 9,
  x: 10,
};

function getTierOrderFromId(id: string): number {
  const match = id.match(/_([ivx]+)$/i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  return ROMAN_TIER_ORDER[match[1].toLowerCase()] ?? Number.MAX_SAFE_INTEGER;
}

function sortByTierOrder(a: GameItem, b: GameItem): number {
  const aTier = getTierOrderFromId(a.id);
  const bTier = getTierOrderFromId(b.id);
  if (aTier !== bTier) return aTier - bTier;
  return a.id.localeCompare(b.id);
}

function buildWeaponFamilies(): WeaponFamily[] {
  const groups = new Map<string, GameItem[]>();
  for (const weapon of weapons) {
    const baseId = getWeaponBaseId(weapon.id);
    if (!groups.has(baseId)) groups.set(baseId, []);
    groups.get(baseId)!.push(weapon);
  }

  return Array.from(groups.entries()).map(([baseId, group]) => {
    const groupIndex = new Map(group.map(item => [item.id, item]));
    const upgradeTargets = new Set(
      group
        .map(item => item.upgradesTo)
        .filter((id): id is string => Boolean(id && groupIndex.has(id)))
    );

    const roots = group.filter(item => !upgradeTargets.has(item.id)).sort(sortByTierOrder);
    const start = roots[0] ?? [...group].sort(sortByTierOrder)[0];

    const chain: GameItem[] = [];
    const visited = new Set<string>();
    let current: GameItem | undefined = start;
    while (current && !visited.has(current.id)) {
      chain.push(current);
      visited.add(current.id);
      current = current.upgradesTo ? groupIndex.get(current.upgradesTo) : undefined;
    }

    const tiers = visited.size === group.length
      ? chain
      : [...group].sort(sortByTierOrder);

    const baseItem = tiers[0];
    const baseName: LocalizedString = {
      en: baseItem.name.en.replace(/\s+[IVX]+$/i, ''),
      'zh-CN': baseItem.name['zh-CN'].replace(/\s+[IVX]+$/i, ''),
    };

    return {
      baseId,
      name: baseName,
      weaponType: baseItem.type,
      tiers,
    };
  });
}

const weaponFamilies = buildWeaponFamilies();

// --- Public API ---

export function getAllItems(): GameItem[] { return allItems; }
export function getItemById(id: string): GameItem | undefined { return itemIndex.get(id); }

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

export function getWeaponFamilies(): WeaponFamily[] { return weaponFamilies; }

export function getWeaponFamilyByBaseId(baseId: string): WeaponFamily | undefined {
  return weaponFamilies.find(f => f.baseId === baseId);
}

export function getWeaponTypes(): string[] {
  const types = new Set(weaponFamilies.map(f => f.weaponType));
  return Array.from(types).sort();
}

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

/** Skip in-raid recipes — they're field disassembly/crafting, not loadout prep. */
function getValidRecipe(item: GameItem): Record<string, number> | null {
  if (!item.recipe || item.craftBench === 'in_raid') return null;
  return Object.keys(item.recipe).length > 0 ? item.recipe : null;
}

export function isCraftable(itemId: string): boolean {
  const item = itemIndex.get(itemId);
  return item !== undefined && getValidRecipe(item) !== null;
}

export function getItemRecipe(itemId: string): { ingredients: Record<string, number>; outputQuantity: number } | null {
  const item = itemIndex.get(itemId);
  if (!item) return null;
  const recipe = getValidRecipe(item);
  if (!recipe) return null;
  return {
    ingredients: recipe,
    outputQuantity: item.craftQuantity,
  };
}

export function getRarityColor(rarity: string | null | undefined): string {
  switch (rarity?.toLowerCase()) {
    case 'common': return '#9ca3af';
    case 'uncommon': return '#22c55e';
    case 'rare': return '#3b82f6';
    case 'epic': return '#a855f7';
    case 'legendary': return '#f59e0b';
    default: return '#9ca3af';
  }
}

export function getCraftableItems(category: ItemCategory): GameItem[] {
  return allItems.filter(i => i.category === category && isCraftable(i.id));
}

export type { ObtainSource };

export function getItemVendors(itemId: string): Vendor[] {
  const item = itemIndex.get(itemId);
  return item?.vendors ?? [];
}

export function getRecycleSources(materialId: string): ObtainSource[] {
  return recycleSourcesMap.get(materialId) ?? [];
}

export function getSalvageSources(materialId: string): ObtainSource[] {
  return salvageSourcesMap.get(materialId) ?? [];
}

export function getFoundIn(itemId: string): string[] {
  const item = itemIndex.get(itemId);
  if (!item?.foundIn) return [];
  return item.foundIn.split(',').map(s => s.trim()).filter(Boolean);
}
