import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { WeaponSelector } from './WeaponSelector';
import { ItemCard } from '../ui/ItemCard';
import { getAugments, getShieldsForAugment, getItemById, getRarityColor, getCraftableItems } from '../../data/gameData';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { Loadout, GameItem, Locale } from '../../types';

// Simple hover-only tooltip (desktop only, no mobile interaction)
function HoverTooltip({
  item,
  locale,
  isHovered,
  triggerRect,
  children,
}: {
  item: GameItem;
  locale: Locale;
  isHovered: boolean;
  triggerRect: DOMRect | null;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  if (!isHovered || !triggerRect || isMobile) return null;

  // Calculate position
  const tooltipWidth = 280;
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  let left = triggerRect.right + 8;
  let top = triggerRect.top;

  // If tooltip would go off right edge, position to the left
  if (left + tooltipWidth > viewport.width - 16) {
    left = triggerRect.left - tooltipWidth - 8;
  }

  // If still off screen, position below
  if (left < 16) {
    left = Math.max(16, triggerRect.left);
    top = triggerRect.bottom + 8;
  }

  // Adjust vertical if needed
  if (top + 200 > viewport.height - 16) {
    top = Math.max(16, viewport.height - 200 - 16);
  }

  return createPortal(
    <div
      className="fixed z-[100] w-70 p-3 rounded-lg border bg-card shadow-xl pointer-events-none"
      style={{
        top,
        left,
        borderColor: getRarityColor(item.rarity),
      }}
    >
      <p className="font-semibold mb-1" style={{ color: getRarityColor(item.rarity) }}>
        {item.name[locale]}
      </p>
      {children}
    </div>,
    document.body
  );
}

interface LoadoutBuilderProps {
  loadout: Loadout;
  onChange: (loadout: Loadout) => void;
}

// Tooltip content for augments
function AugmentTooltipContent({ augment, locale }: { augment: GameItem; locale: Locale }) {
  return (
    <>
      <p className="text-xs text-muted-foreground mb-2">{augment.rarity} Augment</p>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {Object.entries(augment.effects).map(([key, effect]) => (
          <div key={key} className={key === 'Shield Compatibility' ? 'col-span-2' : ''}>
            {effect.label[locale]}: <span className="text-primary">{effect.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// Tooltip content for shields
function ShieldTooltipContent({ shield, locale }: { shield: GameItem; locale: Locale }) {
  return (
    <>
      <p className="text-xs text-muted-foreground mb-2">{shield.rarity} Shield</p>

      <div className="space-y-2 text-sm">
        {Object.entries(shield.effects).map(([key, effect]) => (
          <div key={key} className="flex justify-between">
            <span className="text-muted-foreground">{effect.label[locale]}</span>
            <span className="text-primary">{effect.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// Tooltip content for consumables (healing, grenades, utilities, traps)
function ConsumableTooltipContent({ item, locale }: { item: GameItem; locale: Locale }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        {item.imageUrl && (
          <img src={`/${item.imageUrl}`} alt={item.name[locale]} className="w-12 h-12 object-contain" />
        )}
        <div>
          <p className="text-xs text-muted-foreground">{item.rarity} {item.category}</p>
        </div>
      </div>

      {item.description[locale] && (
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{item.description[locale]}</p>
      )}

      <div className="space-y-2 text-sm border-t border-border pt-3">
        {Object.entries(item.effects).map(([key, effect]) => (
          <div key={key} className="flex justify-between">
            <span className="text-muted-foreground">{effect.label[locale]}</span>
            <span className="text-primary">{effect.value}</span>
          </div>
        ))}
        {item.weightKg > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weight</span>
            <span className="text-muted-foreground">{item.weightKg} kg</span>
          </div>
        )}
        {item.stackSize > 1 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Stack Size</span>
            <span className="text-muted-foreground">{item.stackSize}</span>
          </div>
        )}
      </div>
    </>
  );
}

// Sort by rarity (Common -> Legendary)
function sortByRarity<T extends { rarity: string | null }>(items: T[]): T[] {
  const rarityOrder: Record<string, number> = {
    'Common': 1,
    'Uncommon': 2,
    'Rare': 3,
    'Epic': 4,
    'Legendary': 5,
  };
  return [...items].sort((a, b) => {
    const aOrder = rarityOrder[a.rarity || 'Common'] || 0;
    const bOrder = rarityOrder[b.rarity || 'Common'] || 0;
    return aOrder - bOrder;
  });
}

export function LoadoutBuilder({ loadout, onChange }: LoadoutBuilderProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const [hoveredItem, setHoveredItem] = useState<{ id: string; rect: DOMRect } | null>(null);

  const augments = getAugments();
  const compatibleShields = getShieldsForAugment(loadout.augment);
  const healing = sortByRarity(getCraftableItems('healing'));
  const grenades = sortByRarity(getCraftableItems('grenade'));
  const utilities = sortByRarity(getCraftableItems('utility'));
  const traps = sortByRarity(getCraftableItems('trap'));
  const ammoTypes = getCraftableItems('ammunition');

  const handleMouseEnter = (id: string, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setHoveredItem({ id, rect });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleAugmentChange = (augmentId: string | null) => {
    // When augment changes, check if current shield is still compatible
    let newShield = loadout.shield;
    if (augmentId) {
      const newCompatibleShields = getShieldsForAugment(augmentId);
      if (loadout.shield && !newCompatibleShields.find(s => s.id === loadout.shield)) {
        newShield = null; // Clear shield if no longer compatible
      }
    } else {
      newShield = null; // No augment = no shield
    }
    onChange({ ...loadout, augment: augmentId, shield: newShield });
  };

  const selectedAugment = loadout.augment ? getItemById(loadout.augment) : null;
  const selectedShield = loadout.shield ? getItemById(loadout.shield) : null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{t('loadout.title')}</h2>

      {/* Weapons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <WeaponSelector
            label={t('loadout.primaryWeapon')}
            value={loadout.weapon1}
            onChange={(weapon) => onChange({ ...loadout, weapon1: weapon })}
          />
        </div>
        <div className="relative">
          <WeaponSelector
            label={t('loadout.secondaryWeapon')}
            value={loadout.weapon2}
            onChange={(weapon) => onChange({ ...loadout, weapon2: weapon })}
          />
        </div>
      </div>

      {/* Augment & Shield */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Augment Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">{t('loadout.augment')}</label>
          <div className="flex flex-wrap gap-2">
            {augments.map((augment) => (
              <div
                key={augment.id}
                onMouseEnter={(e) => handleMouseEnter(augment.id, e)}
                onMouseLeave={handleMouseLeave}
              >
                <ItemCard
                  name={augment.name[locale]}
                  image={augment.imageUrl}
                  rarity={augment.rarity}
                  selected={loadout.augment === augment.id}
                  onClick={() => handleAugmentChange(loadout.augment === augment.id ? null : augment.id)}
                  size="sm"
                />
                <HoverTooltip
                  item={augment}
                  locale={locale}
                  isHovered={hoveredItem?.id === augment.id}
                  triggerRect={hoveredItem?.id === augment.id ? hoveredItem.rect : null}
                >
                  <AugmentTooltipContent augment={augment} locale={locale} />
                </HoverTooltip>
              </div>
            ))}
          </div>
          {selectedAugment && (
            <p className="text-xs text-muted-foreground">
              {t('loadout.shield')}: {selectedAugment.effects['Shield Compatibility']?.value || 'None'}
            </p>
          )}
        </div>

        {/* Shield Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">
            {loadout.augment ? t('loadout.shield') : t('loadout.shieldSelectAugment')}
          </label>
          <div className="flex flex-wrap gap-2">
            {compatibleShields.length === 0 && loadout.augment && (
              <p className="text-sm text-muted-foreground">{t('loadout.noCompatibleShields')}</p>
            )}
            {compatibleShields.map((shield) => (
              <div
                key={shield.id}
                onMouseEnter={(e) => handleMouseEnter(shield.id, e)}
                onMouseLeave={handleMouseLeave}
              >
                <ItemCard
                  name={shield.name[locale]}
                  image={shield.imageUrl}
                  rarity={shield.rarity}
                  selected={loadout.shield === shield.id}
                  onClick={() => onChange({ ...loadout, shield: loadout.shield === shield.id ? null : shield.id })}
                  size="sm"
                />
                <HoverTooltip
                  item={shield}
                  locale={locale}
                  isHovered={hoveredItem?.id === shield.id}
                  triggerRect={hoveredItem?.id === shield.id ? hoveredItem.rect : null}
                >
                  <ShieldTooltipContent shield={shield} locale={locale} />
                </HoverTooltip>
              </div>
            ))}
          </div>
          {selectedShield && (
            <p className="text-xs text-muted-foreground">
              {selectedShield.effects['Charge']?.value ?? selectedShield.effects['Shield Charge']?.value ?? ''} HP
              {selectedShield.effects['Damage Reduction']?.value ? ` • ${selectedShield.effects['Damage Reduction'].value} mitigation` : ''}
            </p>
          )}
        </div>
      </div>

      {/* Consumables */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('loadout.consumables')}</h3>

        {/* Healing */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('loadout.healing')}
          </label>
          <div className="flex flex-wrap gap-3">
            {healing.map((item) => {
              const current = loadout.healing.find(h => h.id === item.id);
              const qty = current?.quantity ?? 0;
              const itemName = item.name[locale];

              return (
                <div key={item.id} className="flex flex-col items-center h-[100px]">
                  <div className="w-14 h-14 flex items-center justify-center">
                    <div
                      className={`relative cursor-pointer transition-transform duration-200 ${qty > 0 ? 'scale-110' : 'hover:scale-105'}`}
                      onClick={() => {
                        const newHealing = loadout.healing.filter(h => h.id !== item.id);
                        if (qty === 0) {
                          newHealing.push({ id: item.id, quantity: 1 });
                        }
                        onChange({ ...loadout, healing: newHealing });
                      }}
                      onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img
                        src={`/${item.imageUrl}`}
                        alt={itemName}
                        className="w-12 h-12 object-contain rounded-lg"
                        style={{
                          borderColor: getRarityColor(item.rarity),
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          boxShadow: qty > 0 ? `0 0 16px 4px rgba(59, 130, 246, 0.6), 0 0 8px ${getRarityColor(item.rarity)}` : undefined
                        }}
                      />
                      {qty > 0 && (
                        <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded px-1">
                          {qty}
                        </span>
                      )}
                      <HoverTooltip
                        item={item}
                        locale={locale}
                        isHovered={hoveredItem?.id === item.id}
                        triggerRect={hoveredItem?.id === item.id ? hoveredItem.rect : null}
                      >
                        <ConsumableTooltipContent item={item} locale={locale} />
                      </HoverTooltip>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground truncate max-w-[56px] mt-0.5" title={itemName}>
                    {itemName}
                  </span>
                  {qty > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newHealing = loadout.healing.map(h =>
                            h.id === item.id ? { ...h, quantity: Math.max(0, h.quantity - 1) } : h
                          ).filter(h => h.quantity > 0);
                          onChange({ ...loadout, healing: newHealing });
                        }}
                      >
                        -
                      </button>
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newHealing = loadout.healing.map(h =>
                            h.id === item.id ? { ...h, quantity: h.quantity + 1 } : h
                          );
                          onChange({ ...loadout, healing: newHealing });
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Grenades */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('loadout.grenades')}
          </label>
          <div className="flex flex-wrap gap-3">
            {grenades.map((item) => {
              const current = loadout.grenades.find(g => g.id === item.id);
              const qty = current?.quantity ?? 0;
              const itemName = item.name[locale];

              return (
                <div key={item.id} className="flex flex-col items-center h-[100px]">
                  <div className="w-14 h-14 flex items-center justify-center">
                    <div
                      className={`relative cursor-pointer transition-transform duration-200 ${qty > 0 ? 'scale-110' : 'hover:scale-105'}`}
                      onClick={() => {
                        const newGrenades = loadout.grenades.filter(g => g.id !== item.id);
                        if (qty === 0) {
                          newGrenades.push({ id: item.id, quantity: 1 });
                        }
                        onChange({ ...loadout, grenades: newGrenades });
                      }}
                      onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img
                        src={`/${item.imageUrl}`}
                        alt={itemName}
                        className="w-12 h-12 object-contain rounded-lg"
                        style={{
                          borderColor: getRarityColor(item.rarity),
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          boxShadow: qty > 0 ? `0 0 16px 4px rgba(59, 130, 246, 0.6), 0 0 8px ${getRarityColor(item.rarity)}` : undefined
                        }}
                      />
                      {qty > 0 && (
                        <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded px-1">
                          {qty}
                        </span>
                      )}
                      <HoverTooltip
                        item={item}
                        locale={locale}
                        isHovered={hoveredItem?.id === item.id}
                        triggerRect={hoveredItem?.id === item.id ? hoveredItem.rect : null}
                      >
                        <ConsumableTooltipContent item={item} locale={locale} />
                      </HoverTooltip>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground truncate max-w-[56px] mt-0.5" title={itemName}>
                    {itemName}
                  </span>
                  {qty > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newGrenades = loadout.grenades.map(g =>
                            g.id === item.id ? { ...g, quantity: Math.max(0, g.quantity - 1) } : g
                          ).filter(g => g.quantity > 0);
                          onChange({ ...loadout, grenades: newGrenades });
                        }}
                      >
                        -
                      </button>
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newGrenades = loadout.grenades.map(g =>
                            g.id === item.id ? { ...g, quantity: g.quantity + 1 } : g
                          );
                          onChange({ ...loadout, grenades: newGrenades });
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Utilities */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('loadout.utilities')}
          </label>
          <div className="flex flex-wrap gap-3">
            {utilities.map((item) => {
              const current = loadout.utilities.find(u => u.id === item.id);
              const qty = current?.quantity ?? 0;
              const itemName = item.name[locale];

              return (
                <div key={item.id} className="flex flex-col items-center h-[100px]">
                  <div className="w-14 h-14 flex items-center justify-center">
                    <div
                      className={`relative cursor-pointer transition-transform duration-200 ${qty > 0 ? 'scale-110' : 'hover:scale-105'}`}
                      onClick={() => {
                        const newUtilities = loadout.utilities.filter(u => u.id !== item.id);
                        if (qty === 0) {
                          newUtilities.push({ id: item.id, quantity: 1 });
                        }
                        onChange({ ...loadout, utilities: newUtilities });
                      }}
                      onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img
                        src={`/${item.imageUrl}`}
                        alt={itemName}
                        className="w-12 h-12 object-contain rounded-lg"
                        style={{
                          borderColor: getRarityColor(item.rarity),
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          boxShadow: qty > 0 ? `0 0 16px 4px rgba(59, 130, 246, 0.6), 0 0 8px ${getRarityColor(item.rarity)}` : undefined
                        }}
                      />
                      {qty > 0 && (
                        <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded px-1">
                          {qty}
                        </span>
                      )}
                      <HoverTooltip
                        item={item}
                        locale={locale}
                        isHovered={hoveredItem?.id === item.id}
                        triggerRect={hoveredItem?.id === item.id ? hoveredItem.rect : null}
                      >
                        <ConsumableTooltipContent item={item} locale={locale} />
                      </HoverTooltip>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground truncate max-w-[56px] mt-0.5" title={itemName}>
                    {itemName}
                  </span>
                  {qty > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newUtilities = loadout.utilities.map(u =>
                            u.id === item.id ? { ...u, quantity: Math.max(0, u.quantity - 1) } : u
                          ).filter(u => u.quantity > 0);
                          onChange({ ...loadout, utilities: newUtilities });
                        }}
                      >
                        -
                      </button>
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newUtilities = loadout.utilities.map(u =>
                            u.id === item.id ? { ...u, quantity: u.quantity + 1 } : u
                          );
                          onChange({ ...loadout, utilities: newUtilities });
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Traps */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('loadout.traps')}
          </label>
          <div className="flex flex-wrap gap-3">
            {traps.map((item) => {
              const current = loadout.traps.find(t => t.id === item.id);
              const qty = current?.quantity ?? 0;
              const itemName = item.name[locale];

              return (
                <div key={item.id} className="flex flex-col items-center h-[100px]">
                  <div className="w-14 h-14 flex items-center justify-center">
                    <div
                      className={`relative cursor-pointer transition-transform duration-200 ${qty > 0 ? 'scale-110' : 'hover:scale-105'}`}
                      onClick={() => {
                        const newTraps = loadout.traps.filter(t => t.id !== item.id);
                        if (qty === 0) {
                          newTraps.push({ id: item.id, quantity: 1 });
                        }
                        onChange({ ...loadout, traps: newTraps });
                      }}
                      onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img
                        src={`/${item.imageUrl}`}
                        alt={itemName}
                        className="w-12 h-12 object-contain rounded-lg"
                        style={{
                          borderColor: getRarityColor(item.rarity),
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          boxShadow: qty > 0 ? `0 0 16px 4px rgba(59, 130, 246, 0.6), 0 0 8px ${getRarityColor(item.rarity)}` : undefined
                        }}
                      />
                      {qty > 0 && (
                        <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded px-1">
                          {qty}
                        </span>
                      )}
                      <HoverTooltip
                        item={item}
                        locale={locale}
                        isHovered={hoveredItem?.id === item.id}
                        triggerRect={hoveredItem?.id === item.id ? hoveredItem.rect : null}
                      >
                        <ConsumableTooltipContent item={item} locale={locale} />
                      </HoverTooltip>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground truncate max-w-[56px] mt-0.5" title={itemName}>
                    {itemName}
                  </span>
                  {qty > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newTraps = loadout.traps.map(t =>
                            t.id === item.id ? { ...t, quantity: Math.max(0, t.quantity - 1) } : t
                          ).filter(t => t.quantity > 0);
                          onChange({ ...loadout, traps: newTraps });
                        }}
                      >
                        -
                      </button>
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newTraps = loadout.traps.map(t =>
                            t.id === item.id ? { ...t, quantity: t.quantity + 1 } : t
                          );
                          onChange({ ...loadout, traps: newTraps });
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ammo */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {t('loadout.ammo')}
          </label>
          <div className="flex flex-wrap gap-3">
            {ammoTypes.map((ammo) => {
              const ammoName = ammo.name[locale];
              const current = loadout.ammo.find(a => a.type === ammo.id);
              const qty = current?.quantity ?? 0;

              return (
                <div key={ammo.id} className="flex flex-col items-center h-[100px]">
                  <div className="w-14 h-14 flex items-center justify-center">
                    <div
                      className={`relative cursor-pointer transition-transform duration-200 ${qty > 0 ? 'scale-110' : 'hover:scale-105'}`}
                      onClick={() => {
                        const newAmmo = loadout.ammo.filter(a => a.type !== ammo.id);
                        if (qty === 0) {
                          newAmmo.push({ type: ammo.id, quantity: ammo.craftQuantity || 1 });
                        }
                        onChange({ ...loadout, ammo: newAmmo });
                      }}
                    >
                      <img
                        src={`/${ammo.imageUrl}`}
                        alt={ammoName}
                        className="w-12 h-12 object-contain rounded-lg"
                        style={{
                          borderColor: '#9ca3af',
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          boxShadow: qty > 0 ? '0 0 16px 4px rgba(59, 130, 246, 0.6)' : undefined
                        }}
                      />
                      {qty > 0 && (
                        <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded px-1">
                          {qty}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground truncate max-w-[56px] mt-0.5" title={ammoName}>
                    {ammoName.replace(' Ammo', '').replace(' Clip', '')}
                  </span>
                  {qty > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const outputQty = ammo.craftQuantity || 1;
                          const newAmmo = loadout.ammo.map(a =>
                            a.type === ammo.id ? { ...a, quantity: Math.max(0, a.quantity - outputQty) } : a
                          ).filter(a => a.quantity > 0);
                          onChange({ ...loadout, ammo: newAmmo });
                        }}
                      >
                        -
                      </button>
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const outputQty = ammo.craftQuantity || 1;
                          const newAmmo = loadout.ammo.map(a =>
                            a.type === ammo.id ? { ...a, quantity: a.quantity + outputQty } : a
                          );
                          onChange({ ...loadout, ammo: newAmmo });
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
