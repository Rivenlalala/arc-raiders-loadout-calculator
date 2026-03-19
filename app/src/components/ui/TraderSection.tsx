import { useTranslation } from 'react-i18next';
import { ShoppingCart, ScrollText } from 'lucide-react';
import { getItemById } from '../../data/gameData';
import type { Locale, Vendor } from '../../types';

export function BlueprintBadge() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <ScrollText className="w-4 h-4 text-amber-400" />
      <span className="text-sm font-semibold text-amber-400">
        {t('obtain.blueprintRequired')}
      </span>
    </div>
  );
}

export function TraderSection({ vendors, locale }: { vendors: Vendor[]; locale: Locale }) {
  const { t } = useTranslation();
  if (vendors.length === 0) return null;

  return (
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
          const limitStr = vendor.limit ? ` (${vendor.limit}/day)` : '';

          return (
            <p key={i} className="text-sm">
              <span className="text-primary font-medium">{traderName}</span>
              <span className="text-muted-foreground"> — {costStr}{limitStr}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
}
