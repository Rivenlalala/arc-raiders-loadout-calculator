import { useState } from 'react';
import { WeaponSelector } from './WeaponSelector';
import { ItemCard } from '../ui/ItemCard';
import { getAugments, getShieldsForAugment, getHealing, getGrenades, getQuickUse, getAugmentById, getEquipmentById, getRarityColor } from '../../data/gameData';
import type { Loadout, EquipmentItem } from '../../types';

interface LoadoutBuilderProps {
  loadout: Loadout;
  onChange: (loadout: Loadout) => void;
}

// Tooltip component for augments
function AugmentTooltip({ augment }: { augment: EquipmentItem }) {
  return (
    <div
      className="absolute z-50 left-full top-0 ml-2 w-72 p-3 rounded-lg border bg-card shadow-xl"
      style={{ borderColor: getRarityColor(augment.rarity) }}
    >
      <p className="font-semibold" style={{ color: getRarityColor(augment.rarity) }}>
        {augment.name}
      </p>
      <p className="text-xs text-muted-foreground mb-2">{augment.rarity} Augment</p>

      {augment.special_effect && (
        <p className="text-sm text-green-400 mb-2 p-2 bg-green-400/10 rounded">{augment.special_effect}</p>
      )}

      <div className="grid grid-cols-2 gap-1 text-xs">
        {augment.stats['Backpack Slots'] && (
          <div>Backpack: <span className="text-primary">{augment.stats['Backpack Slots']}</span></div>
        )}
        {augment.stats['Safe Pocket Slots'] && (
          <div>Safe Pocket: <span className="text-primary">{augment.stats['Safe Pocket Slots']}</span></div>
        )}
        {augment.stats['Quick Use Slots'] && (
          <div>Quick Use: <span className="text-primary">{augment.stats['Quick Use Slots']}</span></div>
        )}
        {augment.stats['Weapon Slots'] && (
          <div>Weapons: <span className="text-primary">{augment.stats['Weapon Slots']}</span></div>
        )}
        {augment.stats['Weight Limit'] && (
          <div>Weight: <span className="text-primary">{augment.stats['Weight Limit']}</span></div>
        )}
        {augment.stats['Shield Compatibility'] && (
          <div className="col-span-2">Shield: <span className="text-primary">{augment.stats['Shield Compatibility']}</span></div>
        )}
      </div>
    </div>
  );
}

// Tooltip component for shields
function ShieldTooltip({ shield }: { shield: EquipmentItem }) {
  return (
    <div
      className="absolute z-50 left-full top-0 ml-2 w-56 p-3 rounded-lg border bg-card shadow-xl"
      style={{ borderColor: getRarityColor(shield.rarity) }}
    >
      <p className="font-semibold" style={{ color: getRarityColor(shield.rarity) }}>
        {shield.name}
      </p>
      <p className="text-xs text-muted-foreground mb-2">{shield.rarity} Shield</p>

      <div className="space-y-1 text-sm">
        {shield.stats['Shield Charge'] && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shield Charge</span>
            <span className="text-primary">{shield.stats['Shield Charge']}</span>
          </div>
        )}
        {shield.stats['Damage Mitigation'] && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Damage Mitigation</span>
            <span className="text-green-400">{shield.stats['Damage Mitigation']}</span>
          </div>
        )}
        {shield.stats['Movement Penalty'] && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Movement Penalty</span>
            <span className="text-red-400">{shield.stats['Movement Penalty']}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Tooltip component for consumables (healing, grenades, utilities)
function ConsumableTooltip({ item }: { item: EquipmentItem }) {
  // Define which stats to display based on category
  const healingStats = ['Healing', 'Use Time', 'Duration'];
  const grenadeStats = ['Damage', 'Radius', 'Duration', 'Effect'];
  const utilityStats = ['Duration', 'Effect', 'Radius'];

  const statsToShow = item.category === 'healing' ? healingStats :
    item.category === 'grenades' ? grenadeStats : utilityStats;

  return (
    <div
      className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-lg border bg-card shadow-xl pointer-events-none"
      style={{ borderColor: getRarityColor(item.rarity) }}
    >
      <div className="flex items-center gap-2 mb-2">
        {item.image && (
          <img src={`/${item.image}`} alt={item.name} className="w-10 h-10 object-contain" />
        )}
        <div>
          <p className="font-semibold text-sm" style={{ color: getRarityColor(item.rarity) }}>
            {item.name}
          </p>
          <p className="text-xs text-muted-foreground">{item.rarity} {item.category}</p>
        </div>
      </div>

      {item.description && (
        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{item.description}</p>
      )}

      <div className="space-y-1 text-xs border-t border-border pt-2">
        {statsToShow.map(stat => {
          const value = item.stats[stat];
          if (!value) return null;
          return (
            <div key={stat} className="flex justify-between">
              <span className="text-muted-foreground">{stat}</span>
              <span className="text-primary">{value}</span>
            </div>
          );
        })}
        {item.stats['Weight'] && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weight</span>
            <span className="text-muted-foreground">{item.stats['Weight']}</span>
          </div>
        )}
        {item.stats['Stack Size'] && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Stack Size</span>
            <span className="text-muted-foreground">{item.stats['Stack Size']}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function LoadoutBuilder({ loadout, onChange }: LoadoutBuilderProps) {
  const [hoveredAugment, setHoveredAugment] = useState<EquipmentItem | null>(null);
  const [hoveredShield, setHoveredShield] = useState<EquipmentItem | null>(null);
  const [hoveredConsumable, setHoveredConsumable] = useState<EquipmentItem | null>(null);

  const augments = getAugments();
  const compatibleShields = getShieldsForAugment(loadout.augment);
  const healing = getHealing().filter(h => h.crafting.materials.length > 0);
  const grenades = getGrenades().filter(g => g.crafting.materials.length > 0);
  const utilities = getQuickUse().filter(u => u.crafting.materials.length > 0);

  const handleAugmentChange = (augmentId: string | null) => {
    // When augment changes, check if current shield is still compatible
    let newShield = loadout.shield;
    if (augmentId) {
      const newCompatibleShields = getShieldsForAugment(augmentId);
      if (loadout.shield && !newCompatibleShields.find(s => s.id === loadout.shield)) {
        newShield = null; // Clear shield if no longer compatible
      }
    } else {
      newShield = null; // No augment = no shield
    }
    onChange({ ...loadout, augment: augmentId, shield: newShield });
  };

  const selectedAugment = loadout.augment ? getAugmentById(loadout.augment) : null;
  const selectedShield = loadout.shield ? getEquipmentById(loadout.shield) : null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Loadout Builder</h2>

      {/* Weapons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <WeaponSelector
            label="Primary Weapon"
            value={loadout.weapon1}
            onChange={(weapon) => onChange({ ...loadout, weapon1: weapon })}
          />
        </div>
        <div className="relative">
          <WeaponSelector
            label="Secondary Weapon"
            value={loadout.weapon2}
            onChange={(weapon) => onChange({ ...loadout, weapon2: weapon })}
          />
        </div>
      </div>

      {/* Augment & Shield */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Augment Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">Augment</label>
          <div className="flex flex-wrap gap-2">
            {augments.map((augment) => (
              <div
                key={augment.id}
                className="relative"
                onMouseEnter={() => setHoveredAugment(augment)}
                onMouseLeave={() => setHoveredAugment(null)}
              >
                <ItemCard
                  name={augment.name}
                  image={augment.image}
                  rarity={augment.rarity}
                  selected={loadout.augment === augment.id}
                  onClick={() => handleAugmentChange(loadout.augment === augment.id ? null : augment.id)}
                  size="sm"
                />
                {hoveredAugment?.id === augment.id && <AugmentTooltip augment={augment} />}
              </div>
            ))}
          </div>
          {selectedAugment && (
            <p className="text-xs text-muted-foreground">
              Shield: {selectedAugment.stats['Shield Compatibility'] || 'None'}
              {selectedAugment.special_effect && (
                <span className="text-green-400 ml-2">• {selectedAugment.special_effect}</span>
              )}
            </p>
          )}
        </div>

        {/* Shield Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">
            Shield {!loadout.augment && <span className="text-red-400">(select augment first)</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {compatibleShields.length === 0 && loadout.augment && (
              <p className="text-sm text-muted-foreground">No compatible shields</p>
            )}
            {compatibleShields.map((shield) => (
              <div
                key={shield.id}
                className="relative"
                onMouseEnter={() => setHoveredShield(shield)}
                onMouseLeave={() => setHoveredShield(null)}
              >
                <ItemCard
                  name={shield.name}
                  image={shield.image}
                  rarity={shield.rarity}
                  selected={loadout.shield === shield.id}
                  onClick={() => onChange({ ...loadout, shield: loadout.shield === shield.id ? null : shield.id })}
                  size="sm"
                />
                {hoveredShield?.id === shield.id && <ShieldTooltip shield={shield} />}
              </div>
            ))}
          </div>
          {selectedShield && (
            <p className="text-xs text-muted-foreground">
              {selectedShield.stats['Shield Charge']} HP • {selectedShield.stats['Damage Mitigation']} mitigation
              {selectedShield.stats['Movement Penalty'] && selectedShield.stats['Movement Penalty'] !== '0%' && (
                <span className="text-red-400"> • -{selectedShield.stats['Movement Penalty']} speed</span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Consumables */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Consumables</h3>

        {/* Healing */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Healing Items
          </label>
          <div className="flex flex-wrap gap-3">
            {healing.map((item) => {
              const current = loadout.healing.find(h => h.id === item.id);
              const qty = current?.quantity ?? 0;

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center gap-1"
                  onMouseEnter={() => setHoveredConsumable(item)}
                  onMouseLeave={() => setHoveredConsumable(null)}
                >
                  <div
                    className={`relative cursor-pointer ${qty > 0 ? 'ring-2 ring-primary rounded-lg' : ''}`}
                    onClick={() => {
                      const newHealing = loadout.healing.filter(h => h.id !== item.id);
                      if (qty === 0) {
                        newHealing.push({ id: item.id, quantity: 1 });
                      }
                      onChange({ ...loadout, healing: newHealing });
                    }}
                  >
                    <img
                      src={`/${item.image}`}
                      alt={item.name}
                      className="w-12 h-12 object-contain"
                    />
                    {qty > 0 && (
                      <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded px-1">
                        {qty}
                      </span>
                    )}
                    {hoveredConsumable?.id === item.id && <ConsumableTooltip item={item} />}
                  </div>
                  {qty > 0 && (
                    <div className="flex items-center gap-1">
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newHealing = loadout.healing.map(h =>
                            h.id === item.id ? { ...h, quantity: Math.max(0, h.quantity - 1) } : h
                          ).filter(h => h.quantity > 0);
                          onChange({ ...loadout, healing: newHealing });
                        }}
                      >
                        -
                      </button>
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newHealing = loadout.healing.map(h =>
                            h.id === item.id ? { ...h, quantity: h.quantity + 1 } : h
                          );
                          onChange({ ...loadout, healing: newHealing });
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground truncate max-w-[60px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grenades */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Grenades
          </label>
          <div className="flex flex-wrap gap-3">
            {grenades.map((item) => {
              const current = loadout.grenades.find(g => g.id === item.id);
              const qty = current?.quantity ?? 0;

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center gap-1"
                  onMouseEnter={() => setHoveredConsumable(item)}
                  onMouseLeave={() => setHoveredConsumable(null)}
                >
                  <div
                    className={`relative cursor-pointer ${qty > 0 ? 'ring-2 ring-primary rounded-lg' : ''}`}
                    onClick={() => {
                      const newGrenades = loadout.grenades.filter(g => g.id !== item.id);
                      if (qty === 0) {
                        newGrenades.push({ id: item.id, quantity: 1 });
                      }
                      onChange({ ...loadout, grenades: newGrenades });
                    }}
                  >
                    <img
                      src={`/${item.image}`}
                      alt={item.name}
                      className="w-12 h-12 object-contain"
                    />
                    {qty > 0 && (
                      <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded px-1">
                        {qty}
                      </span>
                    )}
                    {hoveredConsumable?.id === item.id && <ConsumableTooltip item={item} />}
                  </div>
                  {qty > 0 && (
                    <div className="flex items-center gap-1">
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newGrenades = loadout.grenades.map(g =>
                            g.id === item.id ? { ...g, quantity: Math.max(0, g.quantity - 1) } : g
                          ).filter(g => g.quantity > 0);
                          onChange({ ...loadout, grenades: newGrenades });
                        }}
                      >
                        -
                      </button>
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newGrenades = loadout.grenades.map(g =>
                            g.id === item.id ? { ...g, quantity: g.quantity + 1 } : g
                          );
                          onChange({ ...loadout, grenades: newGrenades });
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground truncate max-w-[60px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Utilities */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Utilities
          </label>
          <div className="flex flex-wrap gap-3">
            {utilities.map((item) => {
              const current = loadout.utilities.find(u => u.id === item.id);
              const qty = current?.quantity ?? 0;

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center gap-1"
                  onMouseEnter={() => setHoveredConsumable(item)}
                  onMouseLeave={() => setHoveredConsumable(null)}
                >
                  <div
                    className={`relative cursor-pointer ${qty > 0 ? 'ring-2 ring-primary rounded-lg' : ''}`}
                    onClick={() => {
                      const newUtilities = loadout.utilities.filter(u => u.id !== item.id);
                      if (qty === 0) {
                        newUtilities.push({ id: item.id, quantity: 1 });
                      }
                      onChange({ ...loadout, utilities: newUtilities });
                    }}
                  >
                    <img
                      src={`/${item.image}`}
                      alt={item.name}
                      className="w-12 h-12 object-contain"
                    />
                    {qty > 0 && (
                      <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded px-1">
                        {qty}
                      </span>
                    )}
                    {hoveredConsumable?.id === item.id && <ConsumableTooltip item={item} />}
                  </div>
                  {qty > 0 && (
                    <div className="flex items-center gap-1">
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newUtilities = loadout.utilities.map(u =>
                            u.id === item.id ? { ...u, quantity: Math.max(0, u.quantity - 1) } : u
                          ).filter(u => u.quantity > 0);
                          onChange({ ...loadout, utilities: newUtilities });
                        }}
                      >
                        -
                      </button>
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newUtilities = loadout.utilities.map(u =>
                            u.id === item.id ? { ...u, quantity: u.quantity + 1 } : u
                          );
                          onChange({ ...loadout, utilities: newUtilities });
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground truncate max-w-[60px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
