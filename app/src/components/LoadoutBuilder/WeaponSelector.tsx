import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, X, Search, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getWeaponFamilies, getItemById, getRarityColor } from '../../data/gameData';
import { ItemCard } from '../ui/ItemCard';
import { ModSelector } from './ModSelector';
import { MobileTooltip } from '../ui/MobileTooltip';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { LoadoutWeapon, GameItem, WeaponFamily, Locale } from '../../types';

interface WeaponSelectorProps {
  label: string;
  value: LoadoutWeapon | null;
  onChange: (weapon: LoadoutWeapon | null) => void;
}

// Weapon tooltip content component
function WeaponTooltipContent({ weapon, family, mods, locale, t }: {
  weapon: GameItem;
  family: WeaponFamily | undefined;
  mods: string[];
  locale: Locale;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  const tierIndex = family ? family.tiers.findIndex(tier => tier.id === weapon.id) : 0;
  const currentTierNum = tierIndex + 1;
  const ammoType = weapon.effects['Ammo Type']?.value ?? '';
  const modSlotCount = weapon.modSlots ? Object.keys(weapon.modSlots).length : 0;

  const equippedMods: GameItem[] = mods
    .filter(id => id)
    .map(id => getItemById(id))
    .filter((m): m is GameItem => m !== undefined);

  // Build effect entries (excluding Ammo Type since it's shown separately)
  const effectEntries = Object.entries(weapon.effects).filter(([key]) => key !== 'Ammo Type');

  // Compute tier bonuses: compare current tier effects to tier 1 effects
  const tier1 = family?.tiers[0];
  const tierBonuses: { label: string; value: string }[] = [];
  if (tier1 && tierIndex > 0) {
    for (const [key, effect] of Object.entries(weapon.effects)) {
      if (key === 'Ammo Type') continue;
      const tier1Effect = tier1.effects[key];
      if (tier1Effect && typeof effect.value === 'number' && typeof tier1Effect.value === 'number') {
        const diff = effect.value - tier1Effect.value;
        if (diff !== 0) {
          const sign = diff > 0 ? '+' : '';
          tierBonuses.push({ label: effect.label[locale], value: `${sign}${diff}` });
        }
      }
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        {weapon.imageUrl && (
          <img src={`/${weapon.imageUrl}`} alt={weapon.name[locale]} className="w-14 h-14 object-contain" />
        )}
        <div>
          <p className="text-sm text-muted-foreground">
            {weapon.rarity} {weapon.type}
          </p>
          {currentTierNum > 1 && (
            <p className="text-primary font-medium">{t('weapon.tier')} {currentTierNum}</p>
          )}
        </div>
      </div>

      {/* Basic stats */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        {ammoType && <div>{t('weapon.ammo')} <span className="text-primary">{ammoType}</span></div>}
        <div>{t('weapon.modSlots')} <span className="text-primary">{modSlotCount}</span></div>
      </div>

      {/* All effects */}
      {effectEntries.length > 0 && (
        <div className="border-t border-border pt-3 mb-3">
          <div className="space-y-1">
            {effectEntries.map(([key, effect]) => (
              <div key={key} className="text-sm">
                <span className="text-muted-foreground">{effect.label[locale]}:</span>{' '}
                <span className="text-primary">{effect.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade tiers info */}
      {family && family.tiers.length > 1 && (
        <div className="border-t border-border pt-3 mb-3">
          <p className="text-sm font-semibold text-muted-foreground mb-2">{t('weapon.upgradeTiers')}</p>
          <div className="flex gap-1 mb-2">
            {family.tiers.map((tier, idx) => (
              <span
                key={tier.id}
                className={cn(
                  'w-8 h-8 flex items-center justify-center rounded text-sm',
                  tierIndex === idx ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                )}
              >
                {idx + 1}
              </span>
            ))}
          </div>
          {/* Show current tier bonuses */}
          {tierBonuses.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
              <p className="text-sm font-semibold text-green-400 mb-1">
                {t('weapon.tierBonuses', { tier: currentTierNum })}
              </p>
              {tierBonuses.map((bonus, i) => (
                <p key={i} className="text-sm text-green-400">{bonus.label}: {bonus.value}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Equipped mods effects */}
      {equippedMods.length > 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-sm font-semibold text-muted-foreground mb-2">{t('weapon.equippedMods')}</p>
          <div className="space-y-2">
            {equippedMods.map((mod) => (
              <div key={mod.id} className="text-sm">
                <span className="font-medium" style={{ color: getRarityColor(mod.rarity) }}>
                  {mod.name[locale]}
                </span>
                {Object.entries(mod.effects).map(([key, effect]) => (
                  <p key={key} className="text-green-400 ml-2">
                    • {effect.label[locale]}: {effect.value}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available mod slots (when no mods equipped) */}
      {modSlotCount > 0 && equippedMods.length === 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-sm text-muted-foreground">
            {t('weapon.availableSlots', { count: modSlotCount })}
          </p>
        </div>
      )}
    </>
  );
}

// Desktop-only hover tooltip for dropdown
function DesktopWeaponTooltip({ family, locale, t }: {
  family: WeaponFamily;
  locale: Locale;
  t: (key: string) => string;
}) {
  const firstTier = family.tiers[0];
  const ammoType = firstTier.effects['Ammo Type']?.value ?? '';
  const modSlotCount = firstTier.modSlots ? Object.keys(firstTier.modSlots).length : 0;

  return (
    <div
      className="absolute z-[100] w-64 p-3 rounded-lg border bg-card shadow-xl pointer-events-none left-full top-0 ml-2"
      style={{ borderColor: getRarityColor(firstTier.rarity) }}
    >
      <div className="flex items-center gap-2 mb-2">
        {firstTier.imageUrl && (
          <img src={`/${firstTier.imageUrl}`} alt={family.name[locale]} className="w-10 h-10 object-contain" />
        )}
        <div>
          <p className="font-semibold text-sm" style={{ color: getRarityColor(firstTier.rarity) }}>
            {family.name[locale]}
          </p>
          <p className="text-xs text-muted-foreground">{firstTier.rarity} {family.weaponType}</p>
        </div>
      </div>
      <div className="text-xs space-y-1">
        {ammoType && <div>{t('weapon.ammo')} <span className="text-primary">{ammoType}</span></div>}
        <div>{t('weapon.modSlots')} <span className="text-primary">{modSlotCount}</span></div>
        {family.tiers.length > 1 && (
          <div>{t('weapon.upgradeTiers')}: <span className="text-primary">{family.tiers.length} tiers</span></div>
        )}
      </div>
    </div>
  );
}

export function WeaponSelector({ label, value, onChange }: WeaponSelectorProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [hoveredFamilyId, setHoveredFamilyId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const weaponFamilies = getWeaponFamilies();
  const selectedWeapon = value ? getItemById(value.id) ?? null : null;

  // Find the family of the currently selected weapon
  const selectedFamily = value
    ? weaponFamilies.find(f => f.tiers.some(tier => tier.id === value.id))
    : null;

  // Find the hovered family for desktop tooltip
  const hoveredFamily = hoveredFamilyId
    ? weaponFamilies.find(f => f.baseId === hoveredFamilyId)
    : null;

  // Filter families by search term
  const filteredFamilies = weaponFamilies.filter(f =>
    f.name[locale].toLowerCase().includes(search.toLowerCase()) ||
    f.name.en.toLowerCase().includes(search.toLowerCase()) ||
    f.weaponType.toLowerCase().includes(search.toLowerCase())
  );

  // Group families by weapon type
  const groupedFamilies = filteredFamilies.reduce((acc, family) => {
    if (!acc[family.weaponType]) {
      acc[family.weaponType] = [];
    }
    acc[family.weaponType].push(family);
    return acc;
  }, {} as Record<string, WeaponFamily[]>);

  const handleWeaponSelect = (family: WeaponFamily) => {
    // Select the first tier of the family
    const firstTier = family.tiers[0];
    onChange({
      id: firstTier.id,
      mods: [],
    });
    setIsOpen(false);
    setSearch('');
    setHoveredFamilyId(null);
  };

  const handleTierChange = (tierIndex: number) => {
    if (value && selectedFamily) {
      const newTier = selectedFamily.tiers[tierIndex];
      if (!newTier) return;

      const newModSlots = newTier.modSlots ?? {};
      const newSlotKeys = Object.keys(newModSlots);

      // Get old slot keys to validate existing mods
      const oldModSlots = selectedWeapon?.modSlots ?? {};
      const oldSlotKeys = Object.keys(oldModSlots);

      // Preserve mods that are still valid in the new tier
      const newMods = newSlotKeys.map((slotKey) => {
        const oldIdx = oldSlotKeys.indexOf(slotKey);
        if (oldIdx === -1) return '';
        const existingModId = value.mods[oldIdx] || '';
        // Check if the existing mod is still available in the new tier's slot
        if (existingModId && newModSlots[slotKey]?.includes(existingModId)) {
          return existingModId;
        }
        return '';
      });

      onChange({ id: newTier.id, mods: newMods });
    }
  };

  const handleModChange = (slotIndex: number, modId: string | null) => {
    if (value && selectedWeapon) {
      const slotKeys = Object.keys(selectedWeapon.modSlots ?? {});
      const newMods = [...value.mods];
      // Ensure the mods array is long enough
      while (newMods.length < slotKeys.length) {
        newMods.push('');
      }
      newMods[slotIndex] = modId || '';
      onChange({ ...value, mods: newMods });
    }
  };

  // Compute tier index for display
  const currentTierIndex = selectedFamily
    ? selectedFamily.tiers.findIndex(tier => tier.id === value?.id)
    : 0;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>

      {/* Selected weapon display */}
      <div
        className={cn(
          'relative p-3 rounded-lg border border-border bg-card',
          'hover:bg-secondary/50 cursor-pointer transition-colors',
          isOpen && 'ring-2 ring-primary'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedWeapon && selectedFamily ? (
          <div className="flex items-start gap-3">
            <ItemCard
              name={selectedWeapon.name[locale]}
              image={selectedWeapon.imageUrl}
              rarity={selectedWeapon.rarity}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{selectedFamily.name[locale]}</h4>
                <div className="flex items-center gap-1">
                  {/* Info button for tooltip */}
                  <MobileTooltip
                    title={selectedFamily.name[locale]}
                    borderColor={getRarityColor(selectedWeapon.rarity)}
                    content={
                      <WeaponTooltipContent
                        weapon={selectedWeapon}
                        family={selectedFamily}
                        mods={value?.mods ?? []}
                        locale={locale}
                        t={t}
                      />
                    }
                  >
                    <button
                      className="p-1 hover:bg-secondary rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </MobileTooltip>
                  <button
                    className="p-1 hover:bg-secondary rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{selectedFamily.weaponType}</p>
              <p className="text-sm text-muted-foreground">
                {selectedWeapon.effects['Ammo Type']?.value
                  ? `${selectedWeapon.effects['Ammo Type'].value} • `
                  : ''
                }
                {Object.keys(selectedWeapon.modSlots ?? {}).length} mod slots
              </p>

              {/* Tier selector */}
              {selectedFamily.tiers.length > 1 && (
                <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <span className="text-sm">{t('weapon.tier')}</span>
                  <div className="flex gap-1">
                    {selectedFamily.tiers.map((tier, idx) => (
                      <button
                        key={tier.id}
                        className={cn(
                          'w-8 h-8 rounded font-medium text-sm transition-colors',
                          currentTierIndex === idx
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary hover:bg-secondary/80'
                        )}
                        onClick={() => handleTierChange(idx)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">{t('weapon.select')}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Mod slots */}
      {selectedWeapon && selectedWeapon.modSlots && Object.keys(selectedWeapon.modSlots).length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t('weapon.modifications')}
          </p>
          <div className="space-y-2">
            {Object.entries(selectedWeapon.modSlots).map(([slotKey, modIds], index) => (
              <ModSelector
                key={`${selectedWeapon.id}-${slotKey}`}
                slotName={slotKey}
                modIds={modIds}
                selectedModId={value?.mods[index] || null}
                onSelect={(modId) => handleModChange(index, modId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setHoveredFamilyId(null); }} />
          <div className={cn(
            'z-50 overflow-hidden rounded-lg border border-border bg-card shadow-xl',
            isMobile
              ? 'fixed inset-x-4 top-20 bottom-20'
              : 'absolute mt-1 w-full max-h-96'
          )}>
            {/* Search */}
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('weapon.search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-secondary rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Weapon list by weapon type */}
            <div className={cn(
              'overflow-y-auto p-2',
              isMobile ? 'max-h-[calc(100%-60px)]' : 'max-h-80'
            )}>
              {Object.entries(groupedFamilies).map(([weaponType, families]) => (
                <div key={weaponType} className="mb-4">
                  <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {weaponType}
                  </h5>
                  <div className={cn(
                    'grid gap-2',
                    isMobile ? 'grid-cols-4' : 'grid-cols-3'
                  )}>
                    {families.map((family) => {
                      const firstTier = family.tiers[0];
                      // Check if any tier of this family is currently selected
                      const isSelected = value
                        ? family.tiers.some(tier => tier.id === value.id)
                        : false;

                      return (
                        <div
                          key={family.baseId}
                          className="relative"
                          onMouseEnter={() => !isMobile && setHoveredFamilyId(family.baseId)}
                          onMouseLeave={() => !isMobile && setHoveredFamilyId(null)}
                        >
                          <ItemCard
                            name={family.name[locale]}
                            image={firstTier.imageUrl}
                            rarity={firstTier.rarity}
                            selected={isSelected}
                            size="sm"
                            onClick={() => handleWeaponSelect(family)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {Object.keys(groupedFamilies).length === 0 && (
                <p className="text-center text-muted-foreground py-4">{t('weapon.noResults')}</p>
              )}
            </div>

            {/* Tooltip for hovered weapon in dropdown (desktop only) */}
            {!isMobile && hoveredFamily && (
              <div className="absolute right-0 top-0 -mr-72 hidden md:block">
                <DesktopWeaponTooltip family={hoveredFamily} locale={locale} t={t} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
