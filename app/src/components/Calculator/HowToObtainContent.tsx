import { useTranslation } from 'react-i18next';
import { ShoppingCart, Recycle, Trash2, MapPin } from 'lucide-react';
import { getItemById, getItemVendors, getRecycleSources, getSalvageSources, getFoundIn } from '../../data/gameData';
import type { Locale } from '../../types';

interface HowToObtainContentProps {
  itemId: string;
  itemName: string;
  locale: Locale;
}

export function HowToObtainContent({ itemId, itemName, locale }: HowToObtainContentProps) {
  const { t } = useTranslation();

  const vendors = getItemVendors(itemId);
  const recycleSources = getRecycleSources(itemId);
  const salvageSources = getSalvageSources(itemId);
  const foundIn = getFoundIn(itemId);

  return (
    <div className="space-y-3">
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
            {recycleSources.map((source, i) => {
              const sourceItem = getItemById(source.itemId);
              const sourceName = sourceItem ? sourceItem.name[locale] : source.itemId;
              return (
                <p key={i} className="text-sm">
                  <span className="text-muted-foreground">
                    {t('obtain.recycleItem', { item: sourceName })}
                  </span>
                  <span className="text-green-400 font-medium">
                    {' → '}{source.quantity} {itemName}
                  </span>
                </p>
              );
            })}
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
            {salvageSources.map((source, i) => {
              const sourceItem = getItemById(source.itemId);
              const sourceName = sourceItem ? sourceItem.name[locale] : source.itemId;
              return (
                <p key={i} className="text-sm">
                  <span className="text-muted-foreground">
                    {t('obtain.salvageItem', { item: sourceName })}
                  </span>
                  <span className="text-yellow-400 font-medium">
                    {' → '}{source.quantity} {itemName}
                  </span>
                </p>
              );
            })}
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
  return (
    getItemVendors(itemId).length > 0 ||
    getRecycleSources(itemId).length > 0 ||
    getSalvageSources(itemId).length > 0 ||
    getFoundIn(itemId).length > 0
  );
}
