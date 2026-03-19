# How to Obtain — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a tooltip to resource tree nodes showing how to obtain materials (traders, recycle sources, salvage sources, scavenging locations).

**Architecture:** Add `foundIn` field to GameItem and build reverse recycle/salvage indexes in gameData.ts. Create a HowToObtainContent component rendered inside MobileTooltip, triggered by hovering/tapping item icon+name in TreeNode.

**Tech Stack:** React, TypeScript, react-i18next, existing MobileTooltip component

---

### Task 1: Add `foundIn` to GameItem and types

**Files:**
- Modify: `app/src/types/index.ts:36-65` (GameItem interface)
- Modify: `app/src/data/gameData.ts:55-86` (processRawItem)

**Step 1: Add `foundIn` to GameItem interface**

In `app/src/types/index.ts`, add after `addedIn: string | null;` (line 64):

```typescript
foundIn: string | undefined;
```

**Step 2: Extract `foundIn` in processRawItem**

In `app/src/data/gameData.ts`, add after `addedIn: raw.addedIn ?? null,` (line 84):

```typescript
foundIn: raw.foundIn ?? undefined,
```

**Step 3: Commit**

```bash
git add app/src/types/index.ts app/src/data/gameData.ts
git commit -m "feat: add foundIn field to GameItem"
```

---

### Task 2: Build reverse recycle/salvage indexes and accessor functions

**Files:**
- Modify: `app/src/data/gameData.ts`

**Step 1: Build reverse indexes after allItems initialization (after line 90)**

Add after `const itemIndex = new Map<string, GameItem>(...)` (line 90):

```typescript
// --- Reverse recycle/salvage indexes ---
interface ObtainSource {
  itemId: string;
  quantity: number;
}

const recycleSourcesMap = new Map<string, ObtainSource[]>();
const salvageSourcesMap = new Map<string, ObtainSource[]>();

for (const item of allItems) {
  if (item.recyclesInto) {
    for (const [materialId, qty] of Object.entries(item.recyclesInto)) {
      if (!recycleSourcesMap.has(materialId)) recycleSourcesMap.set(materialId, []);
      recycleSourcesMap.get(materialId)!.push({ itemId: item.id, quantity: qty });
    }
  }
  if (item.salvagesInto) {
    for (const [materialId, qty] of Object.entries(item.salvagesInto)) {
      if (!salvageSourcesMap.has(materialId)) salvageSourcesMap.set(materialId, []);
      salvageSourcesMap.get(materialId)!.push({ itemId: item.id, quantity: qty });
    }
  }
}
```

**Step 2: Add four accessor functions after `getCraftableItems` (after line 208)**

```typescript
export function getItemVendors(itemId: string): Vendor[] {
  const item = itemIndex.get(itemId);
  return item?.vendors ?? [];
}

export function getRecycleSources(materialId: string): ObtainSource[] {
  return recycleSourcesMap.get(materialId) ?? [];
}

export function getSalvageSources(materialId: string): ObtainSource[] {
  return salvageSourcesMap.get(materialId) ?? [];
}

export function getFoundIn(itemId: string): string[] {
  const item = itemIndex.get(itemId);
  if (!item?.foundIn) return [];
  return item.foundIn.split(',').map(s => s.trim()).filter(Boolean);
}
```

**Step 3: Export ObtainSource type**

Add to the top of `gameData.ts` or export inline. The type is used by the component.

**Step 4: Commit**

```bash
git add app/src/data/gameData.ts
git commit -m "feat: add reverse recycle/salvage indexes and obtain accessors"
```

---

### Task 3: Add i18n keys to both locale files

**Files:**
- Modify: `app/src/locales/en.json`
- Modify: `app/src/locales/zh-CN.json`

**Step 1: Add obtain keys to en.json**

Add before the closing `}`:

```json
"obtain.title": "How to Obtain — {{item}}",
"obtain.traders": "Traders",
"obtain.recycleSources": "Recycle Sources",
"obtain.salvageSources": "Salvage Sources",
"obtain.foundIn": "Found In",
"obtain.recycleItem": "Recycle {{item}}",
"obtain.salvageItem": "Salvage {{item}}",

"obtain.trader.Celeste": "Celeste",
"obtain.trader.Shani": "Shani",
"obtain.trader.Tian Wen": "Tian Wen",
"obtain.trader.Apollo": "Apollo",
"obtain.trader.Lance": "Lance",

"obtain.location.ARC": "ARC",
"obtain.location.Commercial": "Commercial",
"obtain.location.Electrical": "Electrical",
"obtain.location.Exodus": "Exodus",
"obtain.location.Industrial": "Industrial",
"obtain.location.Mechanical": "Mechanical",
"obtain.location.Medical": "Medical",
"obtain.location.Nature": "Nature",
"obtain.location.Old World": "Old World",
"obtain.location.Raider": "Raider",
"obtain.location.Residential": "Residential",
"obtain.location.Security": "Security",
"obtain.location.Technological": "Technological"
```

**Step 2: Add same keys to zh-CN.json**

Copy exact same keys and English values into `zh-CN.json`. Translations will be added later.

**Step 3: Commit**

```bash
git add app/src/locales/en.json app/src/locales/zh-CN.json
git commit -m "feat: add i18n keys for how-to-obtain tooltip"
```

---

### Task 4: Create HowToObtainContent component

**Files:**
- Create: `app/src/components/Calculator/HowToObtainContent.tsx`

**Step 1: Create the component**

```tsx
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

/** Check if an item has any obtain info to show */
export function hasObtainInfo(itemId: string): boolean {
  return (
    getItemVendors(itemId).length > 0 ||
    getRecycleSources(itemId).length > 0 ||
    getSalvageSources(itemId).length > 0 ||
    getFoundIn(itemId).length > 0
  );
}
```

**Step 2: Commit**

```bash
git add app/src/components/Calculator/HowToObtainContent.tsx
git commit -m "feat: create HowToObtainContent component"
```

---

### Task 5: Wire tooltip into TreeNode in ResourceTree.tsx

**Files:**
- Modify: `app/src/components/Calculator/ResourceTree.tsx:820-993` (TreeNode component)

**Step 1: Add imports at the top of ResourceTree.tsx**

Add to imports:

```typescript
import { HowToObtainContent, hasObtainInfo } from './HowToObtainContent';
import { MobileTooltip } from '../ui/MobileTooltip';
```

Check that `MobileTooltip` is not already imported. `getRarityColor` is already imported.

**Step 2: Wrap image + name in MobileTooltip in TreeNode**

Replace the image div and name span (lines 879-891):

```tsx
{/* Image - fixed width */}
<div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
  {node.imageUrl && (
    <img
      src={node.imageUrl}
      alt={displayName}
      className="w-8 h-8 object-contain"
    />
  )}
</div>

{/* Name - flexible */}
<span className="flex-1 font-medium min-w-0 truncate">{displayName}</span>
```

With this wrapped version:

```tsx
{/* Image + Name — wrapped in obtain tooltip */}
<MobileTooltip
  title={t('obtain.title', { item: displayName })}
  borderColor={rarityColor}
  disabled={!hasObtainInfo(node.id)}
  content={
    <HowToObtainContent
      itemId={node.id}
      itemName={displayName}
      locale={locale}
    />
  }
>
  <div className="flex items-center gap-2 min-w-0 flex-1 cursor-help">
    {/* Image - fixed width */}
    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
      {node.imageUrl && (
        <img
          src={node.imageUrl}
          alt={displayName}
          className="w-8 h-8 object-contain"
        />
      )}
    </div>

    {/* Name - flexible */}
    <span className="flex-1 font-medium min-w-0 truncate">{displayName}</span>
  </div>
</MobileTooltip>
```

**Step 3: Verify build**

```bash
cd app && npm run build
```

Expected: Build succeeds with no errors in modified files.

**Step 4: Commit**

```bash
git add app/src/components/Calculator/ResourceTree.tsx
git commit -m "feat: wire how-to-obtain tooltip into resource tree nodes"
```

---

### Task 6: Visual verification

**Step 1: Start dev server and verify**

```bash
cd app && npm run dev
```

Open `localhost:5173`, select items in loadout, expand resource tree. Hover over material icon/name — tooltip should appear with traders, recycle sources, salvage sources, and found-in locations.

**Step 2: Verify mobile behavior**

Resize to mobile width (< 768px). Tap on item icon/name — should show bottom sheet with the same content.

**Step 3: Verify items with no obtain info**

Some items may have no vendors, no recycle/salvage sources, and no foundIn. Hovering should do nothing (tooltip disabled).

**Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: adjust how-to-obtain tooltip styling"
```
