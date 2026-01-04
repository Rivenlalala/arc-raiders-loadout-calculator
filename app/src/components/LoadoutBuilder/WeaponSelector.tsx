import { useState } from 'react';
import { ChevronDown, X, Search, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getWeapons, getWeaponById, getModificationById, getRarityColor } from '../../data/gameData';
import { ItemCard } from '../ui/ItemCard';
import { ModSelector } from './ModSelector';
import { MobileTooltip } from '../ui/MobileTooltip';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { LoadoutWeapon, Weapon, Modification } from '../../types';

interface WeaponSelectorProps {
  label: string;
  value: LoadoutWeapon | null;
  onChange: (weapon: LoadoutWeapon | null) => void;
}

// Weapon tooltip content component
function WeaponTooltipContent({ weapon, tier, mods }: {
  weapon: Weapon;
  tier?: number;
  mods?: string[];
}) {
  const currentTier = tier || 1;
  const selectedMods: Modification[] = (mods || [])
    .filter(id => id)
    .map(id => getModificationById(id))
    .filter((m): m is Modification => m !== undefined);

  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        {weapon.image && (
          <img src={`/${weapon.image}`} alt={weapon.name} className="w-14 h-14 object-contain" />
        )}
        <div>
          <p className="text-sm text-muted-foreground">
            {weapon.rarity} {weapon.category}
          </p>
          {currentTier > 1 && (
            <p className="text-primary font-medium">Tier {currentTier}</p>
          )}
        </div>
      </div>

      {/* Basic stats */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>Ammo: <span className="text-primary">{weapon.ammo_type}</span></div>
        <div>Mod Slots: <span className="text-primary">{weapon.modification_slots.length}</span></div>
      </div>

      {/* Upgrade tiers info */}
      {weapon.crafting.upgrades.length > 0 && (
        <div className="border-t border-border pt-3 mb-3">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Upgrade Tiers</p>
          <div className="flex gap-1 mb-2">
            {Array.from({ length: weapon.crafting.upgrades.length + 1 }, (_, i) => i + 1).map((t) => (
              <span
                key={t}
                className={cn(
                  'w-8 h-8 flex items-center justify-center rounded text-sm',
                  currentTier === t ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                )}
              >
                {t}
              </span>
            ))}
          </div>
          {/* Show current tier perks */}
          {currentTier > 1 && weapon.crafting.upgrades[currentTier - 2]?.perks && (
            <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
              <p className="text-sm font-semibold text-green-400 mb-1">Tier {currentTier} Bonuses</p>
              {weapon.crafting.upgrades[currentTier - 2].perks.map((perk, i) => (
                <p key={i} className="text-sm text-green-400">{perk}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected mods effects */}
      {selectedMods.length > 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-sm font-semibold text-muted-foreground mb-2">Equipped Mods</p>
          <div className="space-y-2">
            {selectedMods.map((mod, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium" style={{ color: getRarityColor(mod.rarity) }}>
                  {mod.name}
                </span>
                {mod.stats.effects?.map((effect, j) => (
                  <p key={j} className="text-green-400 ml-2">• {effect}</p>
                ))}
                {!mod.stats.effects && mod.stats.effect && (
                  <p className="text-green-400 ml-2">• {mod.stats.effect}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available mod slots */}
      {weapon.modification_slots.length > 0 && selectedMods.length === 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-sm text-muted-foreground">
            Available Slots: {weapon.modification_slots.join(', ')}
          </p>
        </div>
      )}
    </>
  );
}

// Desktop-only hover tooltip for dropdown
function DesktopWeaponTooltip({ weapon }: { weapon: Weapon }) {
  return (
    <div
      className="absolute z-[100] w-64 p-3 rounded-lg border bg-card shadow-xl pointer-events-none left-full top-0 ml-2"
      style={{ borderColor: getRarityColor(weapon.rarity) }}
    >
      <div className="flex items-center gap-2 mb-2">
        {weapon.image && (
          <img src={`/${weapon.image}`} alt={weapon.name} className="w-10 h-10 object-contain" />
        )}
        <div>
          <p className="font-semibold text-sm" style={{ color: getRarityColor(weapon.rarity) }}>
            {weapon.name}
          </p>
          <p className="text-xs text-muted-foreground">{weapon.rarity} {weapon.category}</p>
        </div>
      </div>
      <div className="text-xs space-y-1">
        <div>Ammo: <span className="text-primary">{weapon.ammo_type}</span></div>
        <div>Mod Slots: <span className="text-primary">{weapon.modification_slots.length}</span></div>
        {weapon.crafting.upgrades.length > 0 && (
          <div>Upgrades: <span className="text-primary">{weapon.crafting.upgrades.length} tiers</span></div>
        )}
      </div>
    </div>
  );
}

export function WeaponSelector({ label, value, onChange }: WeaponSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [hoveredWeaponId, setHoveredWeaponId] = useState<string | null>(null);
  const isMobile = useIsMobile();

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
                <div className="flex items-center gap-1">
                  {/* Info button for mobile tooltip */}
                  <MobileTooltip
                    title={selectedWeapon.name}
                    borderColor={getRarityColor(selectedWeapon.rarity)}
                    content={
                      <WeaponTooltipContent
                        weapon={selectedWeapon}
                        tier={value?.tier}
                        mods={value?.mods}
                      />
                    }
                  >
                    <button
                      className="p-1 hover:bg-secondary rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </MobileTooltip>
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

      {/* Mod slots */}
      {selectedWeapon && selectedWeapon.modification_slots.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Modifications
          </p>
          <div className="space-y-2">
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
          <div className={cn(
            'z-50 overflow-hidden rounded-lg border border-border bg-card shadow-xl',
            isMobile
              ? 'fixed inset-x-4 top-20 bottom-20'
              : 'absolute mt-1 w-full max-h-96'
          )}>
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
            <div className={cn(
              'overflow-y-auto p-2',
              isMobile ? 'max-h-[calc(100%-60px)]' : 'max-h-80'
            )}>
              {Object.entries(groupedWeapons).map(([category, categoryWeapons]) => (
                <div key={category} className="mb-4">
                  <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {category}
                  </h5>
                  <div className={cn(
                    'grid gap-2',
                    isMobile ? 'grid-cols-4' : 'grid-cols-3'
                  )}>
                    {categoryWeapons.map((weapon) => (
                      <div
                        key={weapon.id}
                        className="relative"
                        onMouseEnter={() => !isMobile && setHoveredWeaponId(weapon.id)}
                        onMouseLeave={() => !isMobile && setHoveredWeaponId(null)}
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

            {/* Tooltip for hovered weapon in dropdown (desktop only) */}
            {!isMobile && hoveredWeapon && (
              <div className="absolute right-0 top-0 -mr-72 hidden md:block">
                <DesktopWeaponTooltip weapon={hoveredWeapon} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
