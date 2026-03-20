import { useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Recycle, Trash2, MapPin, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getItemById, getItemVendors, getRecycleSources, getSalvageSources, getFoundIn } from '../../data/gameData';
import type { ObtainSource } from '../../data/gameData';
import type { Locale } from '../../types';
import { BlueprintBadge, TraderSection } from '../ui/TraderSection';

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
  return Array.from(groups.entries())
    .map(([baseName, entries]) => ({ baseName, entries }))
    .sort((a, b) => {
      const aMax = Math.max(...a.entries.map(e => e.quantity));
      const bMax = Math.max(...b.entries.map(e => e.quantity));
      return bMax - aMax;
    });
}

function ExpandableSourceSection({ icon, label, sources, locale, colorClass, translationKey }: {
  icon: ReactNode;
  label: string;
  sources: ObtainSource[];
  locale: Locale;
  colorClass: string;
  translationKey: string;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const grouped = groupSourcesByName(sources, locale);
  const count = grouped.length;

  return (
    <div>
      <div
        className="flex items-center gap-2 mb-2 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        {icon}
        <span className="text-sm font-semibold text-muted-foreground">
          {label}
        </span>
        <span className="text-xs text-muted-foreground/60">({count})</span>
        {expanded
          ? <ChevronDown className="w-3 h-3 text-muted-foreground" />
          : <ChevronRight className="w-3 h-3 text-muted-foreground" />
        }
      </div>
      {expanded && (
        <div className="space-y-1 ml-6">
          {grouped.map(({ baseName, entries }) => (
            <div key={baseName} className="flex items-baseline text-sm">
              <span className="text-muted-foreground flex-1 min-w-0 truncate">
                {t(translationKey, { item: baseName })}
                {entries.length > 1 || entries[0].tier !== '' ? (
                  <span className="opacity-50"> {entries.map(e => e.tier).join(' / ')}</span>
                ) : null}
              </span>
              <span className="text-muted-foreground mx-2 flex-shrink-0">→</span>
              <span className={cn(colorClass, 'font-medium w-24 text-right flex-shrink-0')}>
                {entries.map(e => e.quantity).join(' / ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
      {blueprintLocked && <BlueprintBadge />}

      {/* Traders */}
      {vendors.length > 0 && <TraderSection vendors={vendors} locale={locale} />}

      {/* Recycle Sources */}
      {recycleSources.length > 0 && (
        <ExpandableSourceSection
          icon={<Recycle className="w-4 h-4 text-green-400" />}
          label={t('obtain.recycleSources')}
          sources={recycleSources}
          locale={locale}
          colorClass="text-green-400"
          translationKey="obtain.recycleItem"
        />
      )}

      {/* Salvage Sources */}
      {salvageSources.length > 0 && (
        <ExpandableSourceSection
          icon={<Trash2 className="w-4 h-4 text-yellow-400" />}
          label={t('obtain.salvageSources')}
          sources={salvageSources}
          locale={locale}
          colorClass="text-yellow-400"
          translationKey="obtain.salvageItem"
        />
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
