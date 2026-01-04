# Mod Selector Redesign

## Problem

The current modification selector UI has severe readability issues:
- Mod names are heavily truncated ("Compensator" → "Com...")
- Stats are unreadable ("20% Reduced Recoil" → "20% R...")
- The dropdown is too narrow, constrained to the small trigger button width

## Solution

Replace the compact 2-column pill layout with full-width vertical cards and a centered modal with expandable rows.

## Design

### Selected Mod Cards

**Layout:** Single column, full width. Each mod slot is a horizontal card with consistent height.

**Equipped mod card:**
```
┌─────────────────────────────────────────────────┐
│  [Icon]   Compensator              [i] [×]     │
│   64px    Muzzle                               │
└─────────────────────────────────────────────────┘
```

- Left: Mod icon with rarity border (64x64px)
- Center: Full mod name, slot type in muted text below
- Right: Info button (shows full stats) + remove button

**Empty slot card:**
```
┌─────────────────────────────────────────────────┐
│  [+]      Muzzle                          [›]  │
│  64px     Click to select                      │
└─────────────────────────────────────────────────┘
```

- Dashed border placeholder (64x64px) to match selected state height

### Centered Selection Modal

**Modal specs:**
- Centered on screen (not slide-out)
- Max width: 384px (max-w-sm)
- Max height: 80vh
- Semi-transparent backdrop (click to close)
- Rounded corners with border

**Modal layout:**
```
┌──────────────────────────────────┐
│  Select Muzzle Mod          [×] │
├──────────────────────────────────┤
│  ┌────────────────────────────┐ │
│  │ [Icon]  Compensator    [▼] │ │  ← Collapsed row
│  │         Rare               │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │ [Icon]  Muzzle Brake   [▲] │ │  ← Expanded row
│  │         Uncommon           │ │
│  │  ┌──────────────────────┐  │ │
│  │  │ 15% Reduced Recoil   │  │ │  ← Stats box
│  │  │ +5% Accuracy         │  │ │
│  │  └──────────────────────┘  │ │
│  └────────────────────────────┘ │
│  ...scrollable list...          │
└──────────────────────────────────┘
```

**Each mod row (collapsed):**
- Icon with rarity border (64x64px)
- Full mod name (no truncation)
- Rarity text below name
- Chevron button to expand/collapse

**Expanded state:**
- Green-tinted stats box appears below the row
- Shows ALL stats/effects for the mod
- Click chevron again to collapse

### Interactions

**All platforms:**
- Click empty mod slot → modal opens centered
- Click mod row → selects it, modal closes
- Click chevron (▼/▲) → expands/collapses stats for that row
- Click backdrop or × → closes without selecting
- Escape key → closes modal

**Keyboard:**
- Escape closes modal

## Files Modified

- `app/src/components/ui/SlideOutPanel.tsx` - Reusable centered modal component
- `app/src/components/LoadoutBuilder/ModSelector.tsx` - Card layout + expandable rows
- `app/src/components/LoadoutBuilder/WeaponSelector.tsx` - Single column layout for mods
