# How to Obtain — Tooltip Design

## Overview

Add a tooltip to material nodes in the resource tree showing how to obtain each material: traders, recycle sources, salvage sources, and scavenging locations.

## Data Layer (`gameData.ts`)

### New field on GameItem

- `foundIn: string | undefined` — extracted from raw item's `foundIn` field (comma-separated location types)

### Reverse indexes (built at module load)

Two maps built by scanning all items:

- `recycleSourcesMap: Record<materialId, { itemId: string, quantity: number }[]>` — from all items' `recyclesInto`
- `salvageSourcesMap: Record<materialId, { itemId: string, quantity: number }[]>` — from all items' `salvagesInto`

For example, if `bandage.recyclesInto = { "fabric": 2 }`, then `recycleSourcesMap["fabric"]` includes `{ itemId: "bandage", quantity: 2 }`.

### New accessor functions

- `getItemVendors(id: string)` — returns the item's `vendors` array
- `getRecycleSources(id: string)` — returns items whose `recyclesInto` includes this material
- `getSalvageSources(id: string)` — returns items whose `salvagesInto` includes this material
- `getFoundIn(id: string)` — returns parsed string array of location types

## Component Layer

### Tooltip trigger (ResourceTree.tsx — TreeNode)

Wrap the item image + name area in `MobileTooltip`. On hover (desktop) or tap (mobile), the tooltip opens with obtain info.

If an item has no obtain info (no vendors, no recycle/salvage sources, no foundIn), pass `disabled={true}` to skip the tooltip.

### Tooltip content — HowToObtainContent

A component rendered inside `MobileTooltip` with four sections, each only shown if data exists:

1. **Traders** — icon + "Traders" heading, rows of "{trader name} — {cost}"
2. **Recycle Sources** — icon + "Recycle Sources" heading, rows of "Recycle {item name} → {quantity} {material}"
3. **Salvage Sources** — icon + "Salvage Sources" heading, rows of "Salvage {item name} → {quantity} {material}"
4. **Found In** — icon + "Found In" heading, location types as pill/chip tags

### Styling

Matches existing tooltip patterns. Section headings are small, semibold, with muted foreground. Location pills use rounded bg-secondary chips.

## i18n

### Section labels (both locale files)

- `obtain.title`: "How to Obtain — {{item}}"
- `obtain.traders`: "Traders"
- `obtain.recycleSources`: "Recycle Sources"
- `obtain.salvageSources`: "Salvage Sources"
- `obtain.foundIn`: "Found In"

### Trader names (5 keys, English in both files for now)

- `obtain.trader.Celeste`: "Celeste"
- `obtain.trader.Shani`: "Shani"
- `obtain.trader.Tian Wen`: "Tian Wen"
- `obtain.trader.Apollo`: "Apollo"
- `obtain.trader.Lance`: "Lance"

### Location types (13 keys, English in both files for now)

- `obtain.location.ARC`: "ARC"
- `obtain.location.Commercial`: "Commercial"
- `obtain.location.Electrical`: "Electrical"
- `obtain.location.Exodus`: "Exodus"
- `obtain.location.Industrial`: "Industrial"
- `obtain.location.Mechanical`: "Mechanical"
- `obtain.location.Medical`: "Medical"
- `obtain.location.Nature`: "Nature"
- `obtain.location.Old World`: "Old World"
- `obtain.location.Raider`: "Raider"
- `obtain.location.Residential`: "Residential"
- `obtain.location.Security`: "Security"
- `obtain.location.Technological`: "Technological"

## Data sources

All from `arcraiders-data` npm package:
- `vendors` field on items
- `recyclesInto` / `salvagesInto` fields on items
- `foundIn` field on items
- No need to import `trades.json` separately (item-level vendors has same data)
