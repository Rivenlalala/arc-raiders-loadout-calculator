import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getModificationsBySlot, getModificationById } from '../../data/gameData';
import { ItemCard } from '../ui/ItemCard';
import type { Modification } from '../../types';

interface ModSelectorProps {
  slot: string;
  selectedModId: string | null;
  onSelect: (modId: string | null) => void;
}

export function ModSelector({ slot, selectedModId, onSelect }: ModSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const availableMods = getModificationsBySlot(slot);
  const selectedMod = selectedModId ? getModificationById(selectedModId) : null;

  const handleModSelect = (mod: Modification) => {
    onSelect(mod.id);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
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
              <p className="text-xs text-muted-foreground">{slot}</p>
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
                    >
                      <ItemCard
                        name={mod.name}
                        image={mod.image}
                        rarity={mod.rarity}
                        size="xs"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{mod.name}</p>
                        {mod.effects.length > 0 && (
                          <p className="text-xs text-muted-foreground truncate">
                            {mod.effects[0]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
