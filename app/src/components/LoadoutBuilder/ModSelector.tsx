import { useState } from 'react';
import { ChevronDown, X, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getModificationsForWeaponSlot, getModificationById, getRarityColor } from '../../data/gameData';
import { ItemCard } from '../ui/ItemCard';
import { MobileTooltip } from '../ui/MobileTooltip';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { Modification } from '../../types';

interface ModSelectorProps {
  slot: string;
  weaponName: string;
  selectedModId: string | null;
  onSelect: (modId: string | null) => void;
}

// Tooltip content for mods
function ModTooltipContent({ mod }: { mod: Modification }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        {mod.image && (
          <img src={`/${mod.image}`} alt={mod.name} className="w-12 h-12 object-contain" />
        )}
        <div>
          <p className="text-sm text-muted-foreground">{mod.rarity} • {mod.slot_type}</p>
        </div>
      </div>

      {/* Exact stats - show all effects */}
      {(mod.stats.effects?.length || mod.stats.effect) && (
        <div className="bg-green-500/10 border border-green-500/30 rounded p-2 mb-3">
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
        <div className="text-sm text-muted-foreground mb-3">
          {mod.effects.map((effect, i) => (
            <p key={i}>{effect}</p>
          ))}
        </div>
      )}

      {/* Compatible weapons hint */}
      {mod.compatible_weapons.length > 0 && (
        <p className="text-sm text-muted-foreground border-t border-border pt-3">
          Compatible: {mod.compatible_weapons.join(', ')}
        </p>
      )}
    </>
  );
}

// Desktop-only hover tooltip for dropdown
function DesktopModTooltip({ mod }: { mod: Modification }) {
  return (
    <div
      className="absolute z-[100] w-56 p-3 rounded-lg border bg-card shadow-xl pointer-events-none left-full top-0 ml-2"
      style={{ borderColor: getRarityColor(mod.rarity) }}
    >
      <p className="font-semibold text-sm mb-1" style={{ color: getRarityColor(mod.rarity) }}>
        {mod.name}
      </p>
      <p className="text-xs text-muted-foreground mb-2">{mod.rarity} • {mod.slot_type}</p>
      {(mod.stats.effects?.length || mod.stats.effect) && (
        <div className="text-xs text-green-400 space-y-1">
          {mod.stats.effects?.map((effect, i) => (
            <p key={i}>{effect}</p>
          ))}
          {!mod.stats.effects && mod.stats.effect && <p>{mod.stats.effect}</p>}
        </div>
      )}
    </div>
  );
}

export function ModSelector({ slot, weaponName, selectedModId, onSelect }: ModSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredModId, setHoveredModId] = useState<string | null>(null);
  const isMobile = useIsMobile();

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
            <MobileTooltip
              title={selectedMod.name}
              borderColor={getRarityColor(selectedMod.rarity)}
              content={<ModTooltipContent mod={selectedMod} />}
            >
              <button
                className="p-1 hover:bg-secondary rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <Info className="w-3 h-3 text-muted-foreground" />
              </button>
            </MobileTooltip>
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
          <div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setHoveredModId(null); }} />
          <div className={cn(
            'z-50 overflow-y-auto rounded-lg border border-border bg-card shadow-xl',
            isMobile
              ? 'fixed inset-x-4 top-32 bottom-32'
              : 'absolute mt-1 left-0 right-0 max-h-64'
          )}>
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
                      onMouseEnter={() => !isMobile && setHoveredModId(mod.id)}
                      onMouseLeave={() => !isMobile && setHoveredModId(null)}
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
                      {/* Info button for mobile */}
                      {isMobile && (
                        <MobileTooltip
                          title={mod.name}
                          borderColor={getRarityColor(mod.rarity)}
                          content={<ModTooltipContent mod={mod} />}
                        >
                          <button
                            className="p-1.5 hover:bg-secondary rounded"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </MobileTooltip>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tooltip for hovered mod in dropdown (desktop only) */}
            {!isMobile && hoveredMod && (
              <DesktopModTooltip mod={hoveredMod} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
