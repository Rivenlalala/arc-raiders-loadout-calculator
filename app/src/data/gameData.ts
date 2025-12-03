import type { GameData, Weapon, EquipmentItem, Modification, Material, Ammo } from '../types';
import rawGameData from './game_data.json';

// Type assertion needed because JSON import types don't exactly match our interfaces
export const gameData = rawGameData as unknown as GameData;

// Helper functions for accessing data
export function getWeapons(): Weapon[] {
  return gameData.weapons;
}

export function getWeaponById(id: string): Weapon | undefined {
  return gameData.weapons.find(w => w.id === id);
}

export function getWeaponsByCategory(category: string): Weapon[] {
  return gameData.weapons.filter(w => w.category === category);
}

export function getAugments(): EquipmentItem[] {
  return gameData.equipment.augments;
}

export function getShields(): EquipmentItem[] {
  return gameData.equipment.shields;
}

export function getHealing(): EquipmentItem[] {
  return gameData.equipment.healing;
}

export function getQuickUse(): EquipmentItem[] {
  return gameData.equipment.quick_use;
}

export function getGrenades(): EquipmentItem[] {
  return gameData.equipment.grenades;
}

export function getTraps(): EquipmentItem[] {
  return gameData.equipment.traps;
}

export function getEquipmentById(id: string): EquipmentItem | undefined {
  const allEquipment = [
    ...gameData.equipment.augments,
    ...gameData.equipment.shields,
    ...gameData.equipment.healing,
    ...gameData.equipment.quick_use,
    ...gameData.equipment.grenades,
    ...gameData.equipment.traps,
  ];
  return allEquipment.find(e => e.id === id);
}

export function getModifications(): Modification[] {
  return gameData.modifications;
}

export function getModificationById(id: string): Modification | undefined {
  return gameData.modifications.find(m => m.id === id);
}

export function getModificationsBySlot(slotType: string): Modification[] {
  return gameData.modifications.filter(m => m.slot_type === slotType);
}

// Get modifications for a weapon's slot that are compatible with the weapon
export function getModificationsForWeaponSlot(weaponName: string, slotType: string): Modification[] {
  return gameData.modifications.filter(m => {
    // Must match slot type
    if (m.slot_type !== slotType) return false;
    // If no compatible weapons listed, assume compatible with all
    if (m.compatible_weapons.length === 0) return true;
    // Check if weapon is in compatible list
    return m.compatible_weapons.includes(weaponName);
  });
}

// Get shields compatible with an augment's shield compatibility stat
export function getShieldsForAugment(augmentId: string | null): EquipmentItem[] {
  if (!augmentId) return [];

  const augment = gameData.equipment.augments.find(a => a.id === augmentId);
  if (!augment) return [];

  const shieldCompat = augment.stats['Shield Compatibility'];
  if (!shieldCompat) return [];

  // Parse compatibility (e.g., "Light, Medium" or "Light, Medium, Heavy")
  const compatTypes = shieldCompat.split(',').map(s => s.trim().toLowerCase());

  return gameData.equipment.shields.filter(shield => {
    const shieldType = shield.name.toLowerCase().replace(' shield', '');
    return compatTypes.includes(shieldType);
  });
}

export function getAugmentById(id: string): EquipmentItem | undefined {
  return gameData.equipment.augments.find(a => a.id === id);
}

export function getMaterials(): Material[] {
  return gameData.materials;
}

export function getMaterialByName(name: string): Material | undefined {
  return gameData.materials.find(m => m.name.toLowerCase() === name.toLowerCase());
}

export function getMaterialById(id: string): Material | undefined {
  return gameData.materials.find(m => m.id === id);
}

export function getAmmo(): Ammo[] {
  return gameData.ammo;
}

export function getAmmoByName(name: string): Ammo | undefined {
  return gameData.ammo.find(a => a.name.toLowerCase() === name.toLowerCase());
}

// Get all unique weapon categories
export function getWeaponCategories(): string[] {
  const categories = new Set(gameData.weapons.map(w => w.category));
  return Array.from(categories).sort();
}

// Check if a material can be crafted
export function isCraftable(materialName: string): boolean {
  const material = getMaterialByName(materialName);
  return material !== undefined && material.crafting.materials.length > 0;
}

// Get crafting recipe for a material
export function getMaterialRecipe(materialName: string): { materials: { material: string; quantity: number }[]; outputQuantity: number } | null {
  const material = getMaterialByName(materialName);
  if (!material || material.crafting.materials.length === 0) {
    return null;
  }
  return {
    materials: material.crafting.materials,
    outputQuantity: material.crafting.output_quantity
  };
}

// Get rarity color
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
