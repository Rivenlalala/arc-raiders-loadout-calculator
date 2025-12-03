import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getModificationsForWeaponSlot, getModificationById, getRarityColor } from '../../data/gameData';
import { ItemCard } from '../ui/ItemCard';
import type { Modification } from '../../types';

interface ModSelectorProps {
  slot: string;
  weaponName: string;
  selectedModId: string | null;
  onSelect: (modId: string | null) => void;
}

export function ModSelector({ slot, weaponName, selectedModId, onSelect }: ModSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredMod, setHoveredMod] = useState<Modification | null>(null);

  const availableMods = getModificationsForWeaponSlot(weaponName, slot);
  const selectedMod = selectedModId ? getModificationById(selectedModId) : null;

  const handleModSelect = (mod: Modification) => {
    onSelect(mod.id);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  // Get display stat for a mod
  const getModStat = (mod: Modification): string => {
    if (mod.stats.effect) return mod.stats.effect;
    if (mod.effects.length > 0) return mod.effects[0];
    return '';
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'flex items-center gap-2 p-2 rounded-lg border border-border bg-card/50',
          'hover:bg-secondary/50 cursor-pointer transition-colors',
          isOpen && 'ring-2 ring-primary'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedMod ? (
          <>
            <ItemCard
              name={selectedMod.name}
              image={selectedMod.image}
              rarity={selectedMod.rarity}
              size="xs"
            />
            <div className="flex-1 min-w-0" title={`${selectedMod.name}\n${getModStat(selectedMod)}`}>
              <p className="text-sm font-medium truncate">{selectedMod.name}</p>
              <p className="text-xs text-muted-foreground truncate">{getModStat(selectedMod)}</p>
            </div>
            <button
              className="p-1 hover:bg-secondary rounded"
              onClick={handleClear}
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded bg-secondary/50 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">+</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">{slot}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-1 left-0 right-0 max-h-64 overflow-y-auto rounded-lg border border-border bg-card shadow-xl">
            <div className="p-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {slot} Mods ({availableMods.length})
              </p>
              {availableMods.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No mods available for this slot</p>
              ) : (
                <div className="space-y-1">
                  {availableMods.map((mod) => (
                    <div
                      key={mod.id}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                        selectedModId === mod.id
                          ? 'bg-primary/20 ring-1 ring-primary'
                          : 'hover:bg-secondary/50'
                      )}
                      onClick={() => handleModSelect(mod)}
                      onMouseEnter={() => setHoveredMod(mod)}
                      onMouseLeave={() => setHoveredMod(null)}
                    >
                      <ItemCard
                        name={mod.name}
                        image={mod.image}
                        rarity={mod.rarity}
                        size="xs"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{mod.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {getModStat(mod)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tooltip for hovered mod */}
            {hoveredMod && (
              <div
                className="absolute left-full top-0 ml-2 w-64 p-3 rounded-lg border border-border bg-card shadow-xl z-60"
                style={{ borderColor: getRarityColor(hoveredMod.rarity) }}
              >
                <p className="font-semibold" style={{ color: getRarityColor(hoveredMod.rarity) }}>
                  {hoveredMod.name}
                </p>
                <p className="text-xs text-muted-foreground mb-2">{hoveredMod.rarity} {hoveredMod.slot_type}</p>
                {hoveredMod.stats.effect && (
                  <p className="text-sm text-green-400 mb-2">{hoveredMod.stats.effect}</p>
                )}
                {hoveredMod.effects.map((effect, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{effect}</p>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
