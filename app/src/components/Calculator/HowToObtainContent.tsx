import { useTranslation } from 'react-i18next';
import { ShoppingCart, Recycle, Trash2, MapPin, ScrollText } from 'lucide-react';
import { getItemById, getItemVendors, getRecycleSources, getSalvageSources, getFoundIn } from '../../data/gameData';
import type { ObtainSource } from '../../data/gameData';
import type { Locale } from '../../types';

/** Extract tier suffix (e.g., "III" from "Anvil III") */
function extractTier(name: string): { baseName: string; tier: string } {
  const match = name.match(/^(.+?)\s+([IVX]+)$/i) || name.match(/^(.+?)\s+(Mk\.\s*\d+.*)$/i);
  if (match) return { baseName: match[1], tier: match[2] };
  return { baseName: name, tier: '' };
}

/** Group sources by base name, preserving tier labels and quantities */
function groupSourcesByName(sources: ObtainSource[], locale: Locale): { baseName: string; entries: { tier: string; quantity: number }[] }[] {
  const groups = new Map<string, { tier: string; quantity: number }[]>();
  for (const source of sources) {
    const item = getItemById(source.itemId);
    const fullName = item ? item.name[locale] : source.itemId;
    const { baseName, tier } = extractTier(fullName);
    if (!groups.has(baseName)) groups.set(baseName, []);
    groups.get(baseName)!.push({ tier, quantity: source.quantity });
  }
  return Array.from(groups.entries()).map(([baseName, entries]) => ({ baseName, entries }));
}

interface HowToObtainContentProps {
  itemId: string;
  locale: Locale;
}

export function HowToObtainContent({ itemId, locale }: HowToObtainContentProps) {
  const { t } = useTranslation();

  const item = getItemById(itemId);
  const blueprintLocked = item?.blueprintLocked ?? false;
  const vendors = getItemVendors(itemId);
  const recycleSources = getRecycleSources(itemId);
  const salvageSources = getSalvageSources(itemId);
  const foundIn = getFoundIn(itemId);

  return (
    <div className="space-y-3">
      {/* Blueprint Required */}
      {blueprintLocked && (
        <div className="flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold text-amber-400">
            {t('obtain.blueprintRequired')}
          </span>
        </div>
      )}

      {/* Traders */}
      {vendors.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-muted-foreground">
              {t('obtain.traders')}
            </span>
          </div>
          <div className="space-y-1 ml-6">
            {vendors.map((vendor, i) => {
              const traderName = t(`obtain.trader.${vendor.trader}`, { defaultValue: vendor.trader });
              const costEntries = Object.entries(vendor.cost);
              const costStr = costEntries.map(([costItemId, qty]) => {
                if (costItemId === 'coins') return `${qty} Coins`;
                const costItem = getItemById(costItemId);
                const costName = costItem ? costItem.name[locale] : costItemId;
                return `${qty} ${costName}`;
              }).join(', ');

              return (
                <p key={i} className="text-sm">
                  <span className="text-primary font-medium">{traderName}</span>
                  <span className="text-muted-foreground"> — {costStr}</span>
                </p>
              );
            })}
          </div>
        </div>
      )}

      {/* Recycle Sources */}
      {recycleSources.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Recycle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-muted-foreground">
              {t('obtain.recycleSources')}
            </span>
          </div>
          <div className="space-y-1 ml-6">
            {groupSourcesByName(recycleSources, locale).map(({ baseName, entries }) => (
              <p key={baseName} className="text-sm">
                <span className="text-muted-foreground">
                  {t('obtain.recycleItem', { item: baseName })}
                </span>
                {entries.length === 1 && entries[0].tier === '' ? (
                  <span className="text-green-400 font-medium">
                    {' → '}{entries[0].quantity}
                  </span>
                ) : (
                  <>
                    <span className="text-muted-foreground/60">
                      {' '}{entries.map(e => e.tier).join(' / ')}
                    </span>
                    <span className="text-green-400 font-medium">
                      {' → '}{entries.map(e => e.quantity).join(' / ')}
                    </span>
                  </>
                )}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Salvage Sources */}
      {salvageSources.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trash2 className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-muted-foreground">
              {t('obtain.salvageSources')}
            </span>
          </div>
          <div className="space-y-1 ml-6">
            {groupSourcesByName(salvageSources, locale).map(({ baseName, entries }) => (
              <p key={baseName} className="text-sm">
                <span className="text-muted-foreground">
                  {t('obtain.salvageItem', { item: baseName })}
                </span>
                {entries.length === 1 && entries[0].tier === '' ? (
                  <span className="text-yellow-400 font-medium">
                    {' → '}{entries[0].quantity}
                  </span>
                ) : (
                  <>
                    <span className="text-muted-foreground/60">
                      {' '}{entries.map(e => e.tier).join(' / ')}
                    </span>
                    <span className="text-yellow-400 font-medium">
                      {' → '}{entries.map(e => e.quantity).join(' / ')}
                    </span>
                  </>
                )}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Found In */}
      {foundIn.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-muted-foreground">
              {t('obtain.foundIn')}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 ml-6">
            {foundIn.map((location) => (
              <span
                key={location}
                className="px-2 py-0.5 text-xs rounded-full bg-secondary text-muted-foreground"
              >
                {t(`obtain.location.${location}`, { defaultValue: location })}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function hasObtainInfo(itemId: string): boolean {
  const item = getItemById(itemId);
  return (
    (item?.blueprintLocked ?? false) ||
    getItemVendors(itemId).length > 0 ||
    getRecycleSources(itemId).length > 0 ||
    getSalvageSources(itemId).length > 0 ||
    getFoundIn(itemId).length > 0
  );
}
