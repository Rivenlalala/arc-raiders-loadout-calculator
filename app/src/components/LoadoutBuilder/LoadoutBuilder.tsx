import { useTranslation } from 'react-i18next';
import { Shield, Activity } from 'lucide-react';
import { WeaponSelector } from './WeaponSelector';
import { ItemCard } from '../ui/ItemCard';
import { MobileTooltip } from '../ui/MobileTooltip';
import { getAugments, getShieldsForAugment, getRarityColor, getCraftableItems, getItemVendors } from '../../data/gameData';
import { BlueprintBadge, TraderSection } from '../ui/TraderSection';
import type { Loadout, GameItem, Locale } from '../../types';

interface LoadoutBuilderProps {
  loadout: Loadout;
  onChange: (loadout: Loadout) => void;
}

// Tooltip content for augments
function AugmentTooltipContent({ augment, locale }: { augment: GameItem; locale: Locale }) {
  const vendors = getItemVendors(augment.id);
  const effectEntries = Object.entries(augment.effects);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {augment.imageUrl && <img src={augment.imageUrl} alt={augment.name[locale]} className="w-10 h-10 object-contain" />}
        <div>
          <p className="font-semibold" style={{ color: getRarityColor(augment.rarity) }}>{augment.name[locale]}</p>
          <p className="text-xs text-muted-foreground">{augment.rarity} Augment</p>
        </div>
      </div>
      {effectEntries.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-muted-foreground">Properties</span>
          </div>
          <div className="space-y-1 ml-6">
            {effectEntries.map(([key, effect]) => (
              <div key={key} className="flex justify-between gap-4 text-sm">
                <span className="text-muted-foreground flex-shrink-0">{effect.label[locale]}</span>
                <span className="text-primary font-medium max-w-[55%] text-left ml-auto">{effect.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {augment.blueprintLocked && <BlueprintBadge />}
      {vendors.length > 0 && <TraderSection vendors={vendors} locale={locale} />}
    </div>
  );
}

// Tooltip content for shields
function ShieldTooltipContent({ shield, locale }: { shield: GameItem; locale: Locale }) {
  const vendors = getItemVendors(shield.id);
  const effectEntries = Object.entries(shield.effects);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {shield.imageUrl && <img src={shield.imageUrl} alt={shield.name[locale]} className="w-10 h-10 object-contain" />}
        <div>
          <p className="font-semibold" style={{ color: getRarityColor(shield.rarity) }}>{shield.name[locale]}</p>
          <p className="text-xs text-muted-foreground">{shield.rarity} Shield</p>
        </div>
      </div>
      {effectEntries.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-muted-foreground">Properties</span>
          </div>
          <div className="space-y-1 ml-6">
            {effectEntries.map(([key, effect]) => (
              <div key={key} className="flex justify-between gap-4 text-sm">
                <span className="text-muted-foreground flex-shrink-0">{effect.label[locale]}</span>
                <span className="text-primary font-medium max-w-[55%] text-left ml-auto">{effect.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {vendors.length > 0 && <TraderSection vendors={vendors} locale={locale} />}
    </div>
  );
}

// Tooltip content for consumables (healing, grenades, utilities, traps)
function ConsumableTooltipContent({ item, locale }: { item: GameItem; locale: Locale }) {
  const vendors = getItemVendors(item.id);
  const effectEntries = Object.entries(item.effects);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {item.imageUrl && <img src={item.imageUrl} alt={item.name[locale]} className="w-10 h-10 object-contain" />}
        <div>
          <p className="font-semibold" style={{ color: getRarityColor(item.rarity) }}>{item.name[locale]}</p>
          <p className="text-xs text-muted-foreground">{item.rarity} {item.category}</p>
        </div>
      </div>
      {item.description[locale] && (
        <p className="text-sm text-muted-foreground leading-relaxed">{item.description[locale]}</p>
      )}
      {effectEntries.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-muted-foreground">Effects</span>
          </div>
          <div className="space-y-1 ml-6">
            {effectEntries.map(([key, effect]) => (
              <div key={key} className="flex justify-between gap-4 text-sm">
                <span className="text-muted-foreground flex-shrink-0">{effect.label[locale]}</span>
                <span className="text-primary font-medium max-w-[55%] text-left ml-auto">{effect.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {item.blueprintLocked && <BlueprintBadge />}
      {vendors.length > 0 && <TraderSection vendors={vendors} locale={locale} />}
    </div>
  );
}

// Sort by rarity (Legendary -> Common)
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
    return bOrder - aOrder;
  });
}

export function LoadoutBuilder({ loadout, onChange }: LoadoutBuilderProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;

  const allAugments = getAugments().filter(a => a.id !== 'free_loadout_augment');
  const augmentGroups = [
    { label: 'Combat', items: sortByRarity(allAugments.filter(a => a.id.startsWith('combat_'))) },
    { label: 'Looting', items: sortByRarity(allAugments.filter(a => a.id.startsWith('looting_'))) },
    { label: 'Tactical', items: sortByRarity(allAugments.filter(a => a.id.startsWith('tactical_'))) },
  ];
  const compatibleShields = sortByRarity(getShieldsForAugment(loadout.augment));
  const healing = sortByRarity(getCraftableItems('healing'));
  const grenades = sortByRarity(getCraftableItems('grenade'));
  const utilities = sortByRarity(getCraftableItems('utility'));
  const traps = sortByRarity(getCraftableItems('trap'));
  const ammoTypes = getCraftableItems('ammunition');

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
      <div className="flex flex-col md:flex-row gap-4">
        {/* Augment Selector */}
        <div className="space-y-2 flex-1">
          <label className="block text-sm font-medium text-muted-foreground">{t('loadout.augment')}</label>
          <div className="space-y-1">
            {augmentGroups.map((group) => (
              <div key={group.label} className="flex flex-wrap gap-2">
                {group.items.map((augment) => (
                  <MobileTooltip
                    key={augment.id}
                    title={augment.name[locale]}
                    borderColor={getRarityColor(augment.rarity)}
                    disabled={loadout.augment === augment.id}
                    content={<AugmentTooltipContent augment={augment} locale={locale} />}
                  >
                    <div>
                      <ItemCard
                        name={augment.name[locale]}
                        image={augment.imageUrl}
                        rarity={augment.rarity}
                        selected={loadout.augment === augment.id}
                        onClick={() => handleAugmentChange(loadout.augment === augment.id ? null : augment.id)}
                        size="sm"
                      />
                    </div>
                  </MobileTooltip>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Shield Selector */}
        <div className="space-y-2 w-[210px] flex-shrink-0">
          <label className="block text-sm font-medium text-muted-foreground">
            {t('loadout.shield')}
          </label>
          <div className="flex flex-wrap gap-2">
            {compatibleShields.length === 0 && loadout.augment && (
              <p className="text-sm text-muted-foreground">{t('loadout.noCompatibleShields')}</p>
            )}
            {compatibleShields.map((shield) => (
              <MobileTooltip
                key={shield.id}
                title={shield.name[locale]}
                borderColor={getRarityColor(shield.rarity)}
                disabled={loadout.shield === shield.id}
                content={<ShieldTooltipContent shield={shield} locale={locale} />}
              >
                <div>
                  <ItemCard
                    name={shield.name[locale]}
                    image={shield.imageUrl}
                    rarity={shield.rarity}
                    selected={loadout.shield === shield.id}
                    onClick={() => onChange({ ...loadout, shield: loadout.shield === shield.id ? null : shield.id })}
                    size="sm"
                  />
                </div>
              </MobileTooltip>
            ))}
          </div>
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
                <div key={item.id} className="flex flex-col items-center h-[85px]">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <MobileTooltip
                      title={itemName}
                      borderColor={getRarityColor(item.rarity)}
                      disabled={qty > 0}
                      content={<ConsumableTooltipContent item={item} locale={locale} />}
                    >
                      <div
                        className={`relative cursor-pointer transition-transform duration-200 ${qty > 0 ? 'scale-110' : 'hover:scale-105'}`}
                        onClick={() => {
                          const newHealing = loadout.healing.filter(h => h.id !== item.id);
                          if (qty === 0) {
                            newHealing.push({ id: item.id, quantity: 1 });
                          }
                          onChange({ ...loadout, healing: newHealing });
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={itemName}
                          className="w-14 h-14 object-contain rounded-lg"
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
                      </div>
                    </MobileTooltip>
                  </div>
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
                <div key={item.id} className="flex flex-col items-center h-[85px]">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <MobileTooltip
                      title={itemName}
                      borderColor={getRarityColor(item.rarity)}
                      disabled={qty > 0}
                      content={<ConsumableTooltipContent item={item} locale={locale} />}
                    >
                      <div
                        className={`relative cursor-pointer transition-transform duration-200 ${qty > 0 ? 'scale-110' : 'hover:scale-105'}`}
                        onClick={() => {
                          const newGrenades = loadout.grenades.filter(g => g.id !== item.id);
                          if (qty === 0) {
                            newGrenades.push({ id: item.id, quantity: 1 });
                          }
                          onChange({ ...loadout, grenades: newGrenades });
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={itemName}
                          className="w-14 h-14 object-contain rounded-lg"
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
                      </div>
                    </MobileTooltip>
                  </div>
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
                <div key={item.id} className="flex flex-col items-center h-[85px]">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <MobileTooltip
                      title={itemName}
                      borderColor={getRarityColor(item.rarity)}
                      disabled={qty > 0}
                      content={<ConsumableTooltipContent item={item} locale={locale} />}
                    >
                      <div
                        className={`relative cursor-pointer transition-transform duration-200 ${qty > 0 ? 'scale-110' : 'hover:scale-105'}`}
                        onClick={() => {
                          const newUtilities = loadout.utilities.filter(u => u.id !== item.id);
                          if (qty === 0) {
                            newUtilities.push({ id: item.id, quantity: 1 });
                          }
                          onChange({ ...loadout, utilities: newUtilities });
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={itemName}
                          className="w-14 h-14 object-contain rounded-lg"
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
                      </div>
                    </MobileTooltip>
                  </div>
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
                <div key={item.id} className="flex flex-col items-center h-[85px]">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <MobileTooltip
                      title={itemName}
                      borderColor={getRarityColor(item.rarity)}
                      disabled={qty > 0}
                      content={<ConsumableTooltipContent item={item} locale={locale} />}
                    >
                      <div
                        className={`relative cursor-pointer transition-transform duration-200 ${qty > 0 ? 'scale-110' : 'hover:scale-105'}`}
                        onClick={() => {
                          const newTraps = loadout.traps.filter(t => t.id !== item.id);
                          if (qty === 0) {
                            newTraps.push({ id: item.id, quantity: 1 });
                          }
                          onChange({ ...loadout, traps: newTraps });
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={itemName}
                          className="w-14 h-14 object-contain rounded-lg"
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
                      </div>
                    </MobileTooltip>
                  </div>
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
                <div key={ammo.id} className="flex flex-col items-center h-[85px]">
                  <div className="w-16 h-16 flex items-center justify-center">
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
                        src={ammo.imageUrl}
                        alt={ammoName}
                        className="w-14 h-14 object-contain rounded-lg"
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
