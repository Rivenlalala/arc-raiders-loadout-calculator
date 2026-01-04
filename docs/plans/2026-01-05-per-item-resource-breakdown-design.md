# Per-Item Resource Breakdown Design

## Overview

Add a toggle to the Required Resources section that allows users to view materials grouped by individual loadout item instead of combined.

## Toggle UI

- **Placement:** Top of "Required Resources" section, right-aligned next to heading
- **Label:** "Group by item"
- **Default state:** OFF (combined view, current behavior)
- **State management:** Local component state, no persistence

```
Required Resources                    [○ Group by item]
```

## Per-Item Block Structure

When toggle is ON, display collapsible blocks for each loadout item:

### Block Headers (using item names)

| Item Type | Header Format | Example |
|-----------|--------------|---------|
| Weapon 1 | `{name} (Primary)` | "AK-47 (Primary)" |
| Weapon 2 | `{name} (Secondary)` | "Shotgun X (Secondary)" |
| Augment | `{name}` | "Radar Augment" |
| Shield | `{name}` | "Heavy Shield" |
| Consumables | `{name} x{quantity}` | "Medkit x3" |

### Block Order

1. Weapon 1 (Primary)
2. Weapon 2 (Secondary)
3. Augment
4. Shield
5. Healing items
6. Grenades
7. Utilities
8. Traps

Empty slots are skipped (no empty blocks shown).

### Block Content

Each block contains its own resource tree with expand/collapse crafting breakdown functionality (reusing existing `TreeNodeList` component).

## Resource Calculation

### Data Structure

```typescript
interface ItemResources {
  label: string;        // "AK-47 (Primary)", "Medkit x3", etc.
  resources: Record<string, number>;  // material name → quantity
}
```

### Weapon Blocks Include

- Base weapon crafting materials
- Upgrade materials (based on selected tier)
- All attached mod materials (grouped with weapon)

### Consumable Blocks

- Materials multiplied by quantity

## Visual Behavior

- **Blocks:** Collapsible cards, start expanded by default
- **"Final Materials Needed" section:** Hidden when toggle is ON
- **Toggle styling:** Small switch matching existing Tailwind patterns

## Implementation Notes

- Reuse existing `buildTree()` and `TreeNodeList` components
- Add new `useMemo` for per-item resource calculation
- Single file change: `ResourceTree.tsx`
