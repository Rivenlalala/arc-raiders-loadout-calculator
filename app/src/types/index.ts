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
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  type: string;
  category: ItemCategory;
  rarity: Rarity | null;
  value: number;
  weightKg: number;
  stackSize: number;
  imageUrl: string | null;
  effects: Record<string, ItemEffect>;
  recipe: Record<string, number> | null;
  craftBench: string | string[] | null;
  stationLevelRequired: number | null;
  craftQuantity: number;
  isWeapon: boolean;
  modSlots: Record<string, string[]> | null;
  upgradeCost: Record<string, number> | null;
  upgradesTo: string | null;
  repairCost: Record<string, number> | null;
  repairDurability: number | null;
  compatibleWith: string[] | null;
  blueprintLocked: boolean;
  recyclesInto: Record<string, number> | null;
  salvagesInto: Record<string, number> | null;
  vendors: Vendor[] | null;
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
