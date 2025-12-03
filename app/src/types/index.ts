// Rarity types
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

// Material in a recipe
export interface CraftingMaterial {
  material: string;
  quantity: number;
}

// Base crafting info
export interface CraftingInfo {
  materials: CraftingMaterial[];
  workshop: string | null;
}

// Weapon upgrade
export interface WeaponUpgrade {
  tier: number;
  materials: CraftingMaterial[];
  workshop: string | null;
  perks: string[];  // Upgrade benefits like "25% Increased Bullet Velocity"
}

// Weapon crafting with upgrades
export interface WeaponCrafting extends CraftingInfo {
  upgrades: WeaponUpgrade[];
}

// Weapon
export interface Weapon {
  id: string;
  name: string;
  image: string | null;
  category: string;
  rarity: Rarity;
  ammo_type: string | null;
  modification_slots: string[];
  crafting: WeaponCrafting;
}

// Equipment item (augment, shield, healing, etc.)
export interface EquipmentItem {
  id: string;
  name: string;
  image: string | null;
  category: string;
  rarity: Rarity | null;
  description: string | null;
  special_effect: string | null;  // Passive abilities for augments
  stats: Record<string, string>;
  crafting: CraftingInfo;
}

// Modification stats
export interface ModificationStats {
  effects?: string[];  // List of exact stat effects like ["15% Increased Fire Rate", "20% Increased Recoil"]
  effect?: string;     // Legacy single effect (for backwards compatibility)
  [key: string]: string | string[] | undefined;
}

// Modification
export interface Modification {
  id: string;
  name: string;
  image: string | null;
  slot_type: string;
  rarity: Rarity | null;
  effects: string[];  // Descriptive effects like "Moderately increases fire rate"
  stats: ModificationStats;  // Exact stat percentages
  compatible_weapons: string[];
  crafting: CraftingInfo;
}

// Material (crafting component)
export interface Material {
  id: string;
  name: string;
  image: string | null;
  rarity: Rarity | null;
  weight: number | null;
  stack_size: number | null;
  crafting: CraftingInfo & {
    output_quantity: number;
  };
}

// Ammo type
export interface Ammo {
  id: string;
  name: string;
  image: string | null;
  weight: number | null;
  stack_size: number | null;
  crafting: CraftingInfo & {
    output_quantity: number;
  };
}

// Equipment categories
export interface Equipment {
  augments: EquipmentItem[];
  shields: EquipmentItem[];
  healing: EquipmentItem[];
  quick_use: EquipmentItem[];
  grenades: EquipmentItem[];
  traps: EquipmentItem[];
}

// Full game data structure
export interface GameData {
  version: string;
  last_updated: string;
  weapons: Weapon[];
  equipment: Equipment;
  modifications: Modification[];
  materials: Material[];
  ammo: Ammo[];
}

// Loadout configuration
export interface LoadoutWeapon {
  id: string;
  tier: number;
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

// Resource calculation result
export interface ResourceNode {
  id: string;
  name: string;
  quantity: number;
  rarity: Rarity | null;
  image: string | null;
  canCraft: boolean;
  isExpanded: boolean;
  children: ResourceNode[];
}

export interface CalculatedResources {
  tree: ResourceNode[];
  flatList: { name: string; quantity: number; rarity: Rarity | null }[];
}
