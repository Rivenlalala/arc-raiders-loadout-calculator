import { useState } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getWeapons, getWeaponById, getModificationById, getRarityColor } from '../../data/gameData';
import { ItemCard } from '../ui/ItemCard';
import { ModSelector } from './ModSelector';
import type { LoadoutWeapon, Weapon, Modification } from '../../types';

interface WeaponSelectorProps {
  label: string;
  value: LoadoutWeapon | null;
  onChange: (weapon: LoadoutWeapon | null) => void;
}

// Weapon tooltip component
function WeaponTooltip({ weapon, tier, mods, position = 'right' }: {
  weapon: Weapon;
  tier?: number;
  mods?: string[];
  position?: 'right' | 'bottom';
}) {
  const positionClasses = position === 'right'
    ? 'left-full top-0 ml-2'
    : 'top-full left-1/2 -translate-x-1/2 mt-2';

  const currentTier = tier || 1;
  const selectedMods: Modification[] = (mods || [])
    .filter(id => id)
    .map(id => getModificationById(id))
    .filter((m): m is Modification => m !== undefined);

  return (
    <div
      className={cn(
        'absolute z-[100] w-72 p-3 rounded-lg border bg-card shadow-xl pointer-events-none',
        positionClasses
      )}
      style={{ borderColor: getRarityColor(weapon.rarity) }}
    >
      <div className="flex items-center gap-2 mb-2">
        {weapon.image && (
          <img src={`/${weapon.image}`} alt={weapon.name} className="w-12 h-12 object-contain" />
        )}
        <div>
          <p className="font-semibold" style={{ color: getRarityColor(weapon.rarity) }}>
            {weapon.name} {currentTier > 1 && <span className="text-primary">Tier {currentTier}</span>}
          </p>
          <p className="text-xs text-muted-foreground">{weapon.rarity} {weapon.category}</p>
        </div>
      </div>

      {/* Basic stats */}
      <div className="grid grid-cols-2 gap-1 text-xs mb-2">
        <div>Ammo: <span className="text-primary">{weapon.ammo_type}</span></div>
        <div>Mod Slots: <span className="text-primary">{weapon.modification_slots.length}</span></div>
      </div>

      {/* Upgrade tiers info */}
      {weapon.crafting.upgrades.length > 0 && (
        <div className="border-t border-border pt-2 mb-2">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Upgrade Tiers</p>
          <div className="flex gap-1">
            {Array.from({ length: weapon.crafting.upgrades.length + 1 }, (_, i) => i + 1).map((t) => (
              <span
                key={t}
                className={cn(
                  'w-6 h-6 flex items-center justify-center rounded text-xs',
                  currentTier === t ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                )}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Selected mods effects */}
      {selectedMods.length > 0 && (
        <div className="border-t border-border pt-2">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Equipped Mods</p>
          <div className="space-y-1">
            {selectedMods.map((mod, i) => (
              <div key={i} className="text-xs">
                <span className="font-medium" style={{ color: getRarityColor(mod.rarity) }}>
                  {mod.name}
                </span>
                {mod.stats.effect && (
                  <span className="text-green-400 ml-1">• {mod.stats.effect}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available mod slots */}
      {weapon.modification_slots.length > 0 && selectedMods.length === 0 && (
        <div className="border-t border-border pt-2">
          <p className="text-xs text-muted-foreground">
            Slots: {weapon.modification_slots.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

export function WeaponSelector({ label, value, onChange }: WeaponSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [hoveredWeaponId, setHoveredWeaponId] = useState<string | null>(null);
  const [showSelectedTooltip, setShowSelectedTooltip] = useState(false);

  const weapons = getWeapons();
  const selectedWeapon = value ? getWeaponById(value.id) : null;
  const hoveredWeapon = hoveredWeaponId ? getWeaponById(hoveredWeaponId) : null;

  const filteredWeapons = weapons.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const groupedWeapons = filteredWeapons.reduce((acc, weapon) => {
    if (!acc[weapon.category]) {
      acc[weapon.category] = [];
    }
    acc[weapon.category].push(weapon);
    return acc;
  }, {} as Record<string, Weapon[]>);

  const maxTier = selectedWeapon ? selectedWeapon.crafting.upgrades.length + 1 : 1;

  const handleWeaponSelect = (weapon: Weapon) => {
    onChange({
      id: weapon.id,
      tier: 1,
      mods: [],
    });
    setIsOpen(false);
    setSearch('');
    setHoveredWeaponId(null);
  };

  const handleTierChange = (tier: number) => {
    if (value) {
      onChange({ ...value, tier });
    }
  };

  const handleModChange = (slotIndex: number, modId: string | null) => {
    if (value && selectedWeapon) {
      const newMods = [...value.mods];
      while (newMods.length < selectedWeapon.modification_slots.length) {
        newMods.push('');
      }
      newMods[slotIndex] = modId || '';
      onChange({ ...value, mods: newMods });
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>

      {/* Selected weapon display */}
      <div
        className={cn(
          'relative p-3 rounded-lg border border-border bg-card',
          'hover:bg-secondary/50 cursor-pointer transition-colors',
          isOpen && 'ring-2 ring-primary'
        )}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => selectedWeapon && setShowSelectedTooltip(true)}
        onMouseLeave={() => setShowSelectedTooltip(false)}
      >
        {selectedWeapon ? (
          <div className="flex items-start gap-3">
            <ItemCard
              name={selectedWeapon.name}
              image={selectedWeapon.image}
              rarity={selectedWeapon.rarity}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{selectedWeapon.name}</h4>
                <button
                  className="p-1 hover:bg-secondary rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{selectedWeapon.category}</p>
              <p className="text-sm text-muted-foreground">
                {selectedWeapon.ammo_type} • {selectedWeapon.modification_slots.length} mod slots
              </p>

              {/* Tier selector */}
              <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <span className="text-sm">Tier:</span>
                <div className="flex gap-1">
                  {Array.from({ length: maxTier }, (_, i) => i + 1).map((tier) => (
                    <button
                      key={tier}
                      className={cn(
                        'w-8 h-8 rounded font-medium text-sm transition-colors',
                        value?.tier === tier
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80'
                      )}
                      onClick={() => handleTierChange(tier)}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Select weapon...</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Tooltip for selected weapon */}
      {selectedWeapon && showSelectedTooltip && !isOpen && (
        <div className="relative">
          <WeaponTooltip
            weapon={selectedWeapon}
            tier={value?.tier}
            mods={value?.mods}
            position="bottom"
          />
        </div>
      )}

      {/* Mod slots */}
      {selectedWeapon && selectedWeapon.modification_slots.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Modifications
          </p>
          <div className="grid grid-cols-2 gap-2">
            {selectedWeapon.modification_slots.map((slot, index) => (
              <ModSelector
                key={`${selectedWeapon.id}-${slot}-${index}`}
                slot={slot}
                weaponName={selectedWeapon.name}
                selectedModId={value?.mods[index] || null}
                onSelect={(modId) => handleModChange(index, modId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setHoveredWeaponId(null); }} />
          <div className="absolute z-50 mt-1 w-full max-h-96 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
            {/* Search */}
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search weapons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-secondary rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Weapon list by category */}
            <div className="overflow-y-auto max-h-80 p-2">
              {Object.entries(groupedWeapons).map(([category, categoryWeapons]) => (
                <div key={category} className="mb-4">
                  <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {category}
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {categoryWeapons.map((weapon) => (
                      <div
                        key={weapon.id}
                        className="relative"
                        onMouseEnter={() => setHoveredWeaponId(weapon.id)}
                        onMouseLeave={() => setHoveredWeaponId(null)}
                      >
                        <ItemCard
                          name={weapon.name}
                          image={weapon.image}
                          rarity={weapon.rarity}
                          selected={value?.id === weapon.id}
                          size="sm"
                          onClick={() => handleWeaponSelect(weapon)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {Object.keys(groupedWeapons).length === 0 && (
                <p className="text-center text-muted-foreground py-4">No weapons found</p>
              )}
            </div>

            {/* Tooltip for hovered weapon in dropdown */}
            {hoveredWeapon && (
              <div className="absolute right-0 top-0 -mr-72">
                <WeaponTooltip weapon={hoveredWeapon} position="right" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
