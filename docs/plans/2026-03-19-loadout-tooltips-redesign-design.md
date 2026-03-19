# Loadout Tooltips Redesign — Design

## Overview

Redesign weapon, augment, shield, and consumable tooltips to match the how-to-obtain tooltip style. Add trader and blueprint info. Migrate from desktop-only `HoverTooltip` to `MobileTooltip` for mobile support. Remove the `i` icon from weapon tooltips.

## Changes

### Weapon Tooltip (`WeaponSelector.tsx`)

**Trigger:** Remove the `Info` icon button. Wrap the selected weapon's `ItemCard` + name area in `MobileTooltip` (hover on desktop, tap on mobile).

**Content — consistent section style with icons:**
1. **Header** — item image, name in rarity color, subtitle (rarity + weapon type)
2. **Stats** (crosshair icon) — Ammo Type, Firing Mode, Magazine Size, Mod Slots as key-value rows in `bg` pills
3. **Upgrade Tiers** (layers icon) — tier buttons + green bonus box (existing logic preserved)
4. **Equipped Mods** (wrench icon) — mod name in rarity color + green effect text (existing logic preserved)
5. **Blueprint Required** (scroll-text icon, amber) — only if `blueprintLocked === true`
6. **Traders** (store icon) — trader rows with cost, same format as how-to-obtain

### Augment Tooltip (`LoadoutBuilder.tsx`)

**Trigger:** Migrate from `HoverTooltip` to `MobileTooltip` wrapping the augment `ItemCard`.

**Content:**
1. **Header** — image, name in rarity color, subtitle
2. **Properties** (shield icon) — all effects as key-value rows
3. **Blueprint Required** — if applicable
4. **Traders** (store icon) — trader rows with cost

### Shield Tooltip (`LoadoutBuilder.tsx`)

**Trigger:** Same migration from `HoverTooltip` to `MobileTooltip`.

**Content:**
1. **Header** — image, name in rarity color, subtitle
2. **Properties** (shield icon) — all effects as key-value rows
3. **Traders** (store icon) — trader rows with cost

### Consumable Tooltip (`LoadoutBuilder.tsx`)

**Trigger:** Same migration from `HoverTooltip` to `MobileTooltip`.

**Content:**
1. **Header** — image, name in rarity color, subtitle
2. **Description** — item description text
3. **Effects** (activity icon) — effect key-value rows
4. **Blueprint Required** — if applicable
5. **Traders** (store icon) — trader rows with cost and daily limit

### Shared Styling

- Tooltip border color matches item rarity
- Section headers: icon (12px, colored) + bold label
- Data rows: rounded `bg-secondary` pills with label left, value right
- Blueprint: amber scroll-text icon + "Blueprint Required" in amber
- Traders: store icon, rows with "trader — cost" format
- All text 11px Inter, consistent with how-to-obtain tooltip

### Component Changes

1. **Delete `HoverTooltip`** — replaced by `MobileTooltip` everywhere
2. **Delete `DesktopWeaponTooltip`** — no longer needed (weapon dropdown can use same `MobileTooltip`)
3. **Rewrite `WeaponTooltipContent`** — new section-based layout with icons
4. **Rewrite `AugmentTooltipContent`** — add traders/blueprint
5. **Rewrite `ShieldTooltipContent`** — add traders/blueprint
6. **Rewrite `ConsumableTooltipContent`** — add traders/blueprint
7. **Extract shared `TraderSection` and `BlueprintBadge`** — reuse across all tooltips and `HowToObtainContent`

### i18n

No new keys needed — reuse existing `obtain.traders`, `obtain.blueprintRequired`, `obtain.trader.*` keys.

## Design Reference

Updated mockups in `design.pen`:
- "Weapon Tooltip (redesigned)" frame
- "Augment Tooltip (redesigned)" frame
- "Consumable Tooltip (redesigned)" frame
