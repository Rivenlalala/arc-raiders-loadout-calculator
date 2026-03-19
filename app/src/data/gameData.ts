import type { GameItem, RawGameItem, WeaponFamily, Rarity, ItemCategory, LocalizedString, ItemEffect } from '../types';
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

function classifyCategory(raw: RawGameItem): ItemCategory {
  if (raw.isWeapon) return 'weapon';
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

    const baseId = root.id.replace(/_[ivx]+$/i, '');

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

export function isCraftable(itemId: string): boolean {
  const item = itemIndex.get(itemId);
  return item !== undefined && item.recipe !== null && Object.keys(item.recipe).length > 0;
}

export function getItemRecipe(itemId: string): { ingredients: Record<string, number>; outputQuantity: number } | null {
  const item = itemIndex.get(itemId);
  if (!item || !item.recipe || Object.keys(item.recipe).length === 0) return null;
  return {
    ingredients: item.recipe,
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
  return allItems.filter(i => i.category === category && i.recipe && Object.keys(i.recipe).length > 0);
}
