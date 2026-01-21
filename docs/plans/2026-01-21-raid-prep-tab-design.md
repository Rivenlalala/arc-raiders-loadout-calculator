# Raid Prep Tab Design

Add a second tab to the resource calculator for planning material needs for multiple loadouts.

## Overview

Currently the "Rounds Calculator" lets users enter inventory amounts to see how many loadouts they can craft. This design adds a complementary feature: enter a target number of loadouts and see scaled material requirements.

**Two tabs:**
- **Stash Check** (current feature): "I have these materials, how many loadouts can I make?"
- **Raid Prep** (new feature): "I want X loadouts, what do I need to gather?"

## Tab Structure & State

### State

```typescript
// Shared state (persists across tabs)
expandedNodes: Set<string>        // which craftables are broken down
groupByItem: boolean              // toggle for grouping view
collapsedBlocks: Set<string>      // collapsed item groups

// Stash Check specific
inventory: Record<string, string> // user-entered inventory amounts

// Raid Prep specific
targetRounds: number              // user-entered target (default: 1)

// Derived (Stash Check only)
roundsPossible: number | null     // calculated from inventory
bottleneck: string | null         // limiting resource
```

### Tab Switch Behavior

- **Stash Check → Raid Prep**: If `roundsPossible` has a value, set `targetRounds = roundsPossible`
- **Raid Prep → Stash Check**: Keep existing `inventory` values (don't clear)
- Shared state (expanded nodes, grouping) always persists

## UI Layout

### Tab Header Area

```
┌─────────────────────────────────────────────────────────┐
│ [Stash Check]  [Raid Prep]                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Stash Check:                   Raid Prep:              │
│  ┌─────────────────────┐        ┌─────────────────────┐ │
│  │                     │        │                     │ │
│  │      10 rounds      │        │ Target: [___10___]  │ │
│  │      possible       │        │        rounds       │ │
│  │ Limited by: Metal   │        │                     │ │
│  │          [Clear]    │        │                     │ │
│  └─────────────────────┘        └─────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Resource Tree Row Differences

| Element | Stash Check | Raid Prep |
|---------|-------------|-----------|
| Needed quantity | Base amount (e.g., "10") | Scaled amount (e.g., "50") |
| Right-side input | Inventory input box | None |
| Progress bar | Shows rounds per resource | None |
| Bottleneck highlight | Red background on limiting resource | None |

### Final Materials Summary

- Stash Check: Shows base quantities
- Raid Prep: Shows scaled quantities (base × targetRounds)

## Calculation Logic

### Stash Check (existing, no changes)

- Collects leaf materials from tree (respects expansion state)
- For each resource with inventory input: `rounds = floor(inventory / needed)`
- `roundsPossible` = minimum across all entered resources
- `bottleneck` = resource with the minimum rounds

### Raid Prep (new)

- Simple multiplication: `scaledAmount = baseAmount × targetRounds`
- Applied at display time, not stored separately
- Affects:
  - Resource tree quantities
  - Final Materials summary quantities
  - Per-item grouped view quantities

```typescript
const displayQuantity = node.quantity * (activeTab === 'raid' ? targetRounds : 1);
```

### Edge Cases

- Target rounds = 0: Show all zeros
- Target rounds = 1: Same as current default view
- Empty target input: Treat as 1

## Implementation

### Files to Modify

- `app/src/components/Calculator/ResourceTree.tsx`

### Changes

1. Add state for tab and target rounds:
   ```typescript
   const [activeTab, setActiveTab] = useState<'stash' | 'raid'>('stash');
   const [targetRounds, setTargetRounds] = useState<number>(1);
   ```

2. Add tab switcher component at the top of the return block

3. Modify `RoundsCalculatorDisplay` to be conditional:
   - Stash Check: current layout (rounds possible, bottleneck, clear button)
   - Raid Prep: target input field only

4. Update `TreeNode` component:
   - Pass `activeTab` and `targetRounds` as props
   - Conditionally render inventory input (Stash Check only)
   - Conditionally render progress bar (Stash Check only)
   - Multiply displayed quantity by `targetRounds` when in Raid Prep

5. Update Final Materials summary:
   - Multiply quantities by `targetRounds` when in Raid Prep

6. Tab switch handler:
   - Stash → Raid: set `targetRounds = roundsCalculation.rounds ?? 1`
   - Raid → Stash: no action (preserve inventory)

## Shared Features (Both Tabs)

- Resource tree with expandable craftable items (hammer icon)
- "Group by item" toggle
- "Final Materials Needed" summary at bottom
