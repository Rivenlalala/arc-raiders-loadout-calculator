import { useState } from 'react';
import { ChevronRight, X, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getModificationsForWeaponSlot, getModificationById, getRarityColor } from '../../data/gameData';
import { ItemCard } from '../ui/ItemCard';
import { MobileTooltip } from '../ui/MobileTooltip';
import { SlideOutPanel } from '../ui/SlideOutPanel';
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

// Get all stats for a mod
function getModStats(mod: Modification): string[] {
  const stats: string[] = [];
  if (mod.stats.effects?.length) {
    stats.push(...mod.stats.effects);
  } else if (mod.stats.effect) {
    stats.push(mod.stats.effect);
  }
  if (mod.effects.length > 0) {
    stats.push(...mod.effects);
  }
  return stats;
}

export function ModSelector({ slot, weaponName, selectedModId, onSelect }: ModSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedModId, setExpandedModId] = useState<string | null>(null);

  const availableMods = getModificationsForWeaponSlot(weaponName, slot);
  const selectedMod = selectedModId ? getModificationById(selectedModId) : null;

  const handleModSelect = (mod: Modification) => {
    onSelect(mod.id);
    setIsOpen(false);
    setExpandedModId(null);
  };

  const toggleExpanded = (e: React.MouseEvent, modId: string) => {
    e.stopPropagation();
    setExpandedModId(expandedModId === modId ? null : modId);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <>
      {/* Selected Mod Card */}
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50',
          'hover:bg-secondary/50 cursor-pointer transition-colors min-h-[60px]'
        )}
        onClick={() => setIsOpen(true)}
      >
        {selectedMod ? (
          <>
            <ItemCard
              name={selectedMod.name}
              image={selectedMod.image}
              rarity={selectedMod.rarity}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium">{selectedMod.name}</p>
              <p className="text-sm text-muted-foreground">{slot}</p>
            </div>
            <MobileTooltip
              title={selectedMod.name}
              borderColor={getRarityColor(selectedMod.rarity)}
              content={<ModTooltipContent mod={selectedMod} />}
            >
              <button
                className="p-2 hover:bg-secondary rounded-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <Info className="w-4 h-4 text-muted-foreground" />
              </button>
            </MobileTooltip>
            <button
              className="p-2 hover:bg-secondary rounded-lg"
              onClick={handleClear}
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-lg bg-secondary/50 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <span className="text-xl text-muted-foreground">+</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-muted-foreground">{slot}</p>
              <p className="text-sm text-muted-foreground">Click to select</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </>
        )}
      </div>

      {/* Selection Modal */}
      <SlideOutPanel
        isOpen={isOpen}
        onClose={() => { setIsOpen(false); setExpandedModId(null); }}
        title={`Select ${slot} Mod`}
      >
        <div className="p-3 space-y-2">
          {availableMods.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">No mods available for this slot</p>
          ) : (
            availableMods.map((mod) => {
              const isExpanded = expandedModId === mod.id;
              const stats = getModStats(mod);

              return (
                <div
                  key={mod.id}
                  className={cn(
                    'relative rounded-lg cursor-pointer transition-colors',
                    selectedModId === mod.id
                      ? 'bg-primary/20 ring-2 ring-primary'
                      : 'hover:bg-secondary/50'
                  )}
                >
                  {/* Main row */}
                  <div
                    className="flex items-center gap-3 p-3"
                    onClick={() => handleModSelect(mod)}
                  >
                    <ItemCard
                      name={mod.name}
                      image={mod.image}
                      rarity={mod.rarity}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{mod.name}</p>
                      <p className="text-xs text-muted-foreground">{mod.rarity}</p>
                    </div>
                    {/* Expand/collapse button */}
                    {stats.length > 0 && (
                      <button
                        className="p-2 hover:bg-secondary rounded-lg"
                        onClick={(e) => toggleExpanded(e, mod.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Expanded stats */}
                  {isExpanded && stats.length > 0 && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-2 space-y-1">
                        {stats.map((stat, i) => (
                          <p key={i} className="text-sm text-green-400">{stat}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </SlideOutPanel>
    </>
  );
}
