# Loadout Tooltips Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign all loadout item tooltips to match the how-to-obtain style, add trader/blueprint info, migrate to MobileTooltip for mobile support, and remove the weapon Info icon.

**Architecture:** Extract shared tooltip sections (TraderSection, BlueprintBadge) into reusable components. Rewrite each tooltip content component with icon-based section headers. Replace HoverTooltip with MobileTooltip in LoadoutBuilder. Move weapon tooltip trigger from Info icon to ItemCard hover.

**Tech Stack:** React, TypeScript, react-i18next, lucide-react icons, existing MobileTooltip component

---

### Task 1: Extract shared TraderSection and BlueprintBadge components

**Files:**
- Create: `app/src/components/ui/TraderSection.tsx`

**Step 1: Create the shared components file**

```tsx
import { useTranslation } from 'react-i18next';
import { ShoppingCart, ScrollText } from 'lucide-react';
import { getItemById, getItemVendors } from '../../data/gameData';
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
```

**Step 2: Update HowToObtainContent to use shared components**

In `app/src/components/Calculator/HowToObtainContent.tsx`, replace the inline Blueprint and Traders sections with the shared `BlueprintBadge` and `TraderSection` components. Import them from `../../components/ui/TraderSection`. Remove the duplicated rendering code for those two sections.

**Step 3: Verify build**

```bash
cd app && npm run build
```

**Step 4: Commit**

```bash
git add app/src/components/ui/TraderSection.tsx app/src/components/Calculator/HowToObtainContent.tsx
git commit -m "refactor: extract shared TraderSection and BlueprintBadge components"
```

---

### Task 2: Rewrite tooltip content components in LoadoutBuilder

**Files:**
- Modify: `app/src/components/LoadoutBuilder/LoadoutBuilder.tsx`

**Step 1: Replace AugmentTooltipContent, ShieldTooltipContent, ConsumableTooltipContent**

Replace the three tooltip content functions (lines ~73-147) with new versions that use icon-based section headers and include trader/blueprint info. Import the shared components and needed icons.

Add to imports:
```tsx
import { Crosshair, Shield, Activity } from 'lucide-react';
import { getItemVendors } from '../../data/gameData';
import { BlueprintBadge, TraderSection } from '../ui/TraderSection';
```

New `AugmentTooltipContent`:
```tsx
function AugmentTooltipContent({ augment, locale }: { augment: GameItem; locale: Locale }) {
  const { t } = useTranslation();
  const vendors = getItemVendors(augment.id);
  const effectEntries = Object.entries(augment.effects);

  return (
    <div className="space-y-3">
      {effectEntries.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-muted-foreground">Properties</span>
          </div>
          <div className="space-y-1 ml-6">
            {effectEntries.map(([key, effect]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{effect.label[locale]}</span>
                <span className="text-primary font-medium">{effect.value}</span>
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
```

New `ShieldTooltipContent`:
```tsx
function ShieldTooltipContent({ shield, locale }: { shield: GameItem; locale: Locale }) {
  const { t } = useTranslation();
  const vendors = getItemVendors(shield.id);
  const effectEntries = Object.entries(shield.effects);

  return (
    <div className="space-y-3">
      {effectEntries.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-muted-foreground">Properties</span>
          </div>
          <div className="space-y-1 ml-6">
            {effectEntries.map(([key, effect]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{effect.label[locale]}</span>
                <span className="text-primary font-medium">{effect.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {vendors.length > 0 && <TraderSection vendors={vendors} locale={locale} />}
    </div>
  );
}
```

New `ConsumableTooltipContent`:
```tsx
function ConsumableTooltipContent({ item, locale }: { item: GameItem; locale: Locale }) {
  const { t } = useTranslation();
  const vendors = getItemVendors(item.id);
  const effectEntries = Object.entries(item.effects);

  return (
    <div className="space-y-3">
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
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{effect.label[locale]}</span>
                <span className="text-primary font-medium">{effect.value}</span>
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
```

**Step 2: Verify build**

```bash
cd app && npm run build
```

**Step 3: Commit**

```bash
git add app/src/components/LoadoutBuilder/LoadoutBuilder.tsx
git commit -m "feat: redesign augment, shield, consumable tooltip content with icons and trader info"
```

---

### Task 3: Migrate HoverTooltip to MobileTooltip in LoadoutBuilder

**Files:**
- Modify: `app/src/components/LoadoutBuilder/LoadoutBuilder.tsx`

**Step 1: Replace HoverTooltip usage with MobileTooltip**

Add `MobileTooltip` import:
```tsx
import { MobileTooltip } from '../ui/MobileTooltip';
```

For each augment in the augment grid (around line 232), replace the `HoverTooltip` pattern:

**Before:**
```tsx
<div
  key={augment.id}
  onMouseEnter={(e) => handleMouseEnter(augment.id, e)}
  onMouseLeave={handleMouseLeave}
>
  <ItemCard ... />
  <HoverTooltip item={augment} locale={locale} isHovered={...} triggerRect={...}>
    <AugmentTooltipContent ... />
  </HoverTooltip>
</div>
```

**After:**
```tsx
<MobileTooltip
  key={augment.id}
  title={augment.name[locale]}
  borderColor={getRarityColor(augment.rarity)}
  content={<AugmentTooltipContent augment={augment} locale={locale} />}
>
  <ItemCard ... />
</MobileTooltip>
```

Apply the same pattern to:
- Shield items (~line 273)
- Healing items (~line 317) — wrap the image div, not the outer container
- Grenade items (~line 410)
- Utility items (~line 500)
- Trap items (~line 590)

**Step 2: Remove HoverTooltip component and related state**

Delete the `HoverTooltip` function (lines 11-66). Remove the `hoveredItem` state and `handleMouseEnter`/`handleMouseLeave` functions. Remove the `createPortal` import if no longer used. Remove `useIsMobile` import if no longer used in this file.

**Step 3: Verify build**

```bash
cd app && npm run build
```

**Step 4: Commit**

```bash
git add app/src/components/LoadoutBuilder/LoadoutBuilder.tsx
git commit -m "feat: migrate loadout tooltips from HoverTooltip to MobileTooltip"
```

---

### Task 4: Redesign weapon tooltip and remove Info icon

**Files:**
- Modify: `app/src/components/LoadoutBuilder/WeaponSelector.tsx`

**Step 1: Add trader/blueprint sections to WeaponTooltipContent**

Import shared components:
```tsx
import { BlueprintBadge, TraderSection } from '../ui/TraderSection';
import { getItemVendors } from '../../data/gameData';
```

At the bottom of the `WeaponTooltipContent` function (before the closing `</>`), add:

```tsx
{/* Blueprint Required */}
{weapon.blueprintLocked && (
  <div className="border-t border-border pt-3">
    <BlueprintBadge />
  </div>
)}

{/* Traders */}
{(() => {
  const vendors = getItemVendors(weapon.id);
  if (vendors.length === 0) return null;
  return (
    <div className="border-t border-border pt-3">
      <TraderSection vendors={vendors} locale={locale} />
    </div>
  );
})()}
```

**Step 2: Move tooltip trigger from Info icon to ItemCard**

In the selected weapon display (around line 307), wrap the `ItemCard` in `MobileTooltip` and remove the Info icon button.

**Before (lines 308-339):**
```tsx
<div className="flex items-start gap-3">
  <ItemCard ... />
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between">
      <h4 ...>{selectedFamily.name[locale]}</h4>
      <div className="flex items-center gap-1">
        <MobileTooltip ...>
          <button><Info ... /></button>
        </MobileTooltip>
        <button onClick={...}><X ... /></button>
      </div>
    </div>
    ...
```

**After:**
```tsx
<div className="flex items-start gap-3">
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
    <ItemCard ... />
  </MobileTooltip>
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between">
      <h4 ...>{selectedFamily.name[locale]}</h4>
      <button onClick={...}><X ... /></button>
    </div>
    ...
```

Remove the `Info` import from lucide-react if no longer used.

**Step 3: Verify build**

```bash
cd app && npm run build
```

**Step 4: Commit**

```bash
git add app/src/components/LoadoutBuilder/WeaponSelector.tsx
git commit -m "feat: add trader/blueprint to weapon tooltip and move trigger to ItemCard"
```

---

### Task 5: Visual verification and cleanup

**Step 1: Start dev server**

```bash
cd app && npm run dev
```

**Step 2: Verify all tooltips**

- Hover over weapon ItemCard → tooltip with stats, tiers, mods, blueprint, traders
- Hover over augment cards → tooltip with properties, traders
- Hover over shield cards → tooltip with properties, traders
- Hover over consumable items (healing, grenades, utilities, traps) → tooltip with description, effects, blueprint, traders
- Check mobile (resize to < 768px) → tap shows bottom sheet for all tooltips

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: polish loadout tooltip styling"
```
