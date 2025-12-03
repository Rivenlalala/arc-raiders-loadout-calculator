import { useState } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getWeapons, getWeaponById } from '../../data/gameData';
import { ItemCard } from '../ui/ItemCard';
import type { LoadoutWeapon, Weapon } from '../../types';

interface WeaponSelectorProps {
  label: string;
  value: LoadoutWeapon | null;
  onChange: (weapon: LoadoutWeapon | null) => void;
}

export function WeaponSelector({ label, value, onChange }: WeaponSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const weapons = getWeapons();
  const selectedWeapon = value ? getWeaponById(value.id) : null;

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
  };

  const handleTierChange = (tier: number) => {
    if (value) {
      onChange({ ...value, tier });
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

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
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
                      <ItemCard
                        key={weapon.id}
                        name={weapon.name}
                        image={weapon.image}
                        rarity={weapon.rarity}
                        selected={value?.id === weapon.id}
                        size="sm"
                        onClick={() => handleWeaponSelect(weapon)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {Object.keys(groupedWeapons).length === 0 && (
                <p className="text-center text-muted-foreground py-4">No weapons found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
