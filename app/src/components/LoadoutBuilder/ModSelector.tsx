import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, X, ChevronDown, ChevronUp, Wrench } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getItemById, getRarityColor, getItemVendors } from '../../data/gameData';
import { BlueprintBadge, TraderSection } from '../ui/TraderSection';
import { ItemCard } from '../ui/ItemCard';
import { MobileTooltip } from '../ui/MobileTooltip';
import { SlideOutPanel } from '../ui/SlideOutPanel';
import type { GameItem, Locale } from '../../types';

interface ModSelectorProps {
  slotName: string;       // Display name like "Muzzle", "Stock"
  modIds: string[];       // Compatible mod IDs from weapon.modSlots[slot]
  selectedModId: string | null;
  onSelect: (modId: string | null) => void;
}

// Tooltip content for mods
function ModTooltipContent({ mod, locale }: { mod: GameItem; locale: Locale }) {
  const effectEntries = Object.entries(mod.effects);
  const vendors = getItemVendors(mod.id);

  return (
    <div className="space-y-3">
      {/* Effects */}
      {effectEntries.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-muted-foreground">Effects</span>
          </div>
          <div className="space-y-1 ml-6">
            {effectEntries.map(([key, effect]) => (
              <div key={key} className="flex justify-between gap-4 text-sm">
                <span className="text-muted-foreground flex-shrink-0">{effect.label[locale]}</span>
                <span className="text-green-400 font-medium max-w-[55%] text-left ml-auto">{effect.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blueprint Required */}
      {mod.blueprintLocked && <BlueprintBadge />}

      {/* Traders */}
      {vendors.length > 0 && <TraderSection vendors={vendors} locale={locale} />}
    </div>
  );
}

// Get display strings for mod effects
function getModEffects(mod: GameItem, locale: Locale): string[] {
  return Object.entries(mod.effects).map(
    ([, effect]) => `${effect.label[locale]}: ${effect.value}`
  );
}

export function ModSelector({ slotName, modIds, selectedModId, onSelect }: ModSelectorProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const [expandedModId, setExpandedModId] = useState<string | null>(null);

  // Resolve mod IDs to GameItem objects, filtering out any that don't exist
  const availableMods = modIds
    .map(id => getItemById(id))
    .filter((item): item is GameItem => item !== undefined);

  const selectedMod = selectedModId ? getItemById(selectedModId) ?? null : null;

  const handleModSelect = (mod: GameItem) => {
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
          'flex items-center gap-3 p-3 rounded-lg border border-border bg-card',
          'hover:bg-secondary/50 cursor-pointer transition-colors min-h-[60px]'
        )}
        onClick={() => setIsOpen(true)}
      >
        {selectedMod ? (
          <>
            <MobileTooltip
              title={selectedMod.name[locale]}
              borderColor={getRarityColor(selectedMod.rarity)}
              content={<ModTooltipContent mod={selectedMod} locale={locale} />}
            >
              <ItemCard
                name={selectedMod.name[locale]}
                image={selectedMod.imageUrl}
                rarity={selectedMod.rarity}
                size="sm"
              />
            </MobileTooltip>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{selectedMod.name[locale]}</p>
              <p className="text-sm text-muted-foreground">{slotName}</p>
            </div>
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
              <p className="font-medium text-muted-foreground">{slotName}</p>
              <p className="text-sm text-muted-foreground">{t('mod.clickToSelect')}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </>
        )}
      </div>

      {/* Selection Modal */}
      <SlideOutPanel
        isOpen={isOpen}
        onClose={() => { setIsOpen(false); setExpandedModId(null); }}
        title={t('mod.select', { slot: slotName })}
      >
        <div className="p-3 space-y-2">
          {availableMods.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">{t('mod.noMods')}</p>
          ) : (
            availableMods.map((mod) => {
              const isExpanded = expandedModId === mod.id;
              const effects = getModEffects(mod, locale);

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
                      name={mod.name[locale]}
                      image={mod.imageUrl}
                      rarity={mod.rarity}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{mod.name[locale]}</p>
                      <p className="text-xs text-muted-foreground">{mod.rarity}</p>
                    </div>
                    {/* Expand/collapse button */}
                    {effects.length > 0 && (
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

                  {/* Expanded effects */}
                  {isExpanded && effects.length > 0 && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-2 space-y-1">
                        {effects.map((effect, i) => (
                          <p key={i} className="text-sm text-green-400">{effect}</p>
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
