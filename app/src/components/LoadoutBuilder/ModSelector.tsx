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

// Tooltip component for mods
function ModTooltip({ mod, position = 'right' }: { mod: Modification; position?: 'right' | 'bottom' }) {
  const positionClasses = position === 'right'
    ? 'left-full top-0 ml-2'
    : 'top-full left-0 mt-2';

  return (
    <div
      className={cn(
        'absolute z-[100] w-64 p-3 rounded-lg border bg-card shadow-xl pointer-events-none',
        positionClasses
      )}
      style={{ borderColor: getRarityColor(mod.rarity) }}
    >
      <div className="flex items-center gap-2 mb-2">
        {mod.image && (
          <img src={`/${mod.image}`} alt={mod.name} className="w-10 h-10 object-contain" />
        )}
        <div>
          <p className="font-semibold" style={{ color: getRarityColor(mod.rarity) }}>
            {mod.name}
          </p>
          <p className="text-xs text-muted-foreground">{mod.rarity} • {mod.slot_type}</p>
        </div>
      </div>

      {/* Exact stats - show all effects */}
      {(mod.stats.effects?.length || mod.stats.effect) && (
        <div className="bg-green-500/10 border border-green-500/30 rounded p-2 mb-2">
          {mod.stats.effects?.map((effect, i) => (
            <p key={i} className="text-sm text-green-400 font-medium">{effect}</p>
          ))}
          {!mod.stats.effects && mod.stats.effect && (
            <p className="text-sm text-green-400 font-medium">{mod.stats.effect}</p>
          )}
        </div>
      )}

      {/* Effects description */}
      {mod.effects.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {mod.effects.map((effect, i) => (
            <p key={i}>{effect}</p>
          ))}
        </div>
      )}

      {/* Compatible weapons hint */}
      {mod.compatible_weapons.length > 0 && (
        <p className="text-xs text-muted-foreground mt-2 border-t border-border pt-2">
          Compatible: {mod.compatible_weapons.join(', ')}
        </p>
      )}
    </div>
  );
}

export function ModSelector({ slot, weaponName, selectedModId, onSelect }: ModSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredModId, setHoveredModId] = useState<string | null>(null);
  const [showSelectedTooltip, setShowSelectedTooltip] = useState(false);

  const availableMods = getModificationsForWeaponSlot(weaponName, slot);
  const selectedMod = selectedModId ? getModificationById(selectedModId) : null;
  const hoveredMod = hoveredModId ? getModificationById(hoveredModId) : null;

  const handleModSelect = (mod: Modification) => {
    onSelect(mod.id);
    setIsOpen(false);
    setHoveredModId(null);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  // Get display stat for a mod (first effect from stats.effects or stats.effect)
  const getModStat = (mod: Modification): string => {
    if (mod.stats.effects?.length) return mod.stats.effects[0];
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
        onMouseEnter={() => selectedMod && setShowSelectedTooltip(true)}
        onMouseLeave={() => setShowSelectedTooltip(false)}
      >
        {selectedMod ? (
          <>
            <ItemCard
              name={selectedMod.name}
              image={selectedMod.image}
              rarity={selectedMod.rarity}
              size="xs"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedMod.name}</p>
              <p className="text-xs text-green-400 truncate">{getModStat(selectedMod)}</p>
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

      {/* Tooltip for selected mod */}
      {selectedMod && showSelectedTooltip && !isOpen && (
        <ModTooltip mod={selectedMod} position="bottom" />
      )}

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setHoveredModId(null); }} />
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
                        'relative flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                        selectedModId === mod.id
                          ? 'bg-primary/20 ring-1 ring-primary'
                          : 'hover:bg-secondary/50'
                      )}
                      onClick={() => handleModSelect(mod)}
                      onMouseEnter={() => setHoveredModId(mod.id)}
                      onMouseLeave={() => setHoveredModId(null)}
                    >
                      <ItemCard
                        name={mod.name}
                        image={mod.image}
                        rarity={mod.rarity}
                        size="xs"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{mod.name}</p>
                        <p className="text-xs text-green-400 truncate">
                          {getModStat(mod)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tooltip for hovered mod in dropdown */}
            {hoveredMod && (
              <ModTooltip mod={hoveredMod} position="right" />
            )}
          </div>
        </>
      )}
    </div>
  );
}
