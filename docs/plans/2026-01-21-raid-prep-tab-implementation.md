# Raid Prep Tab Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Raid Prep" tab alongside "Stash Check" that lets users enter a target number of loadouts and see scaled material requirements.

**Architecture:** Single file modification to ResourceTree.tsx. Add tab state and conditionally render different header content and tree node elements based on active tab. Scaling is applied at display time via multiplication.

**Tech Stack:** React, TypeScript, Tailwind CSS

---

## Task 1: Add Tab State and Tab Switcher UI

**Files:**
- Modify: `app/src/components/Calculator/ResourceTree.tsx:34-42` (add state)
- Modify: `app/src/components/Calculator/ResourceTree.tsx:450-458` (add tab UI)

**Step 1: Add new state variables**

After line 42 (after `const [inventory, setInventory] = ...`), add:

```typescript
// Tab state: 'stash' for Stash Check, 'raid' for Raid Prep
const [activeTab, setActiveTab] = useState<'stash' | 'raid'>('stash');
// Target rounds for Raid Prep tab
const [targetRounds, setTargetRounds] = useState<number>(1);
```

**Step 2: Create tab switch handler**

After the `clearInventory` function (around line 438), add:

```typescript
const handleTabSwitch = (tab: 'stash' | 'raid') => {
  if (tab === 'raid' && activeTab === 'stash') {
    // Switching to Raid Prep: carry over calculated rounds
    if (roundsCalculation.rounds !== null) {
      setTargetRounds(roundsCalculation.rounds);
    }
  }
  setActiveTab(tab);
};
```

**Step 3: Add tab switcher component**

Replace the `RoundsCalculatorDisplay` component call (around line 453-458) with:

```typescript
{/* Tab Switcher */}
<div className="flex gap-2 mb-4">
  <button
    onClick={() => handleTabSwitch('stash')}
    className={cn(
      'px-4 py-2 rounded-lg font-medium transition-colors',
      activeTab === 'stash'
        ? 'bg-primary text-primary-foreground'
        : 'bg-secondary text-muted-foreground hover:text-foreground'
    )}
  >
    Stash Check
  </button>
  <button
    onClick={() => handleTabSwitch('raid')}
    className={cn(
      'px-4 py-2 rounded-lg font-medium transition-colors',
      activeTab === 'raid'
        ? 'bg-primary text-primary-foreground'
        : 'bg-secondary text-muted-foreground hover:text-foreground'
    )}
  >
    Raid Prep
  </button>
</div>

{/* Tab Content */}
{activeTab === 'stash' ? (
  <RoundsCalculatorDisplay
    rounds={roundsCalculation.rounds}
    bottleneck={roundsCalculation.bottleneck}
    hasAnyInput={roundsCalculation.hasAnyInput}
    onClear={clearInventory}
  />
) : (
  <RaidPrepDisplay
    targetRounds={targetRounds}
    onTargetChange={setTargetRounds}
  />
)}
```

**Step 4: Run dev server and verify tabs render**

Run: `cd app && npm run dev`
Expected: Two tabs visible, clicking switches between them (Raid Prep content placeholder for now)

**Step 5: Commit**

```bash
git add app/src/components/Calculator/ResourceTree.tsx
git commit -m "feat: add tab state and tab switcher UI for Stash Check / Raid Prep"
```

---

## Task 2: Create RaidPrepDisplay Component

**Files:**
- Modify: `app/src/components/Calculator/ResourceTree.tsx:592-639` (add after RoundsCalculatorDisplay)

**Step 1: Add RaidPrepDisplay component**

After the `RoundsCalculatorDisplay` function (around line 639), add:

```typescript
// Raid Prep display component
function RaidPrepDisplay({
  targetRounds,
  onTargetChange,
}: {
  targetRounds: number;
  onTargetChange: (value: number) => void;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-lg font-semibold mb-4">Raid Prep</h3>
      <div className="text-center py-4">
        <label className="block text-muted-foreground mb-2">
          Plan for how many loadouts?
        </label>
        <input
          type="number"
          min="0"
          value={targetRounds}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            onTargetChange(isNaN(val) ? 1 : val);
          }}
          className="w-24 px-3 py-2 text-center text-2xl font-bold rounded border border-border bg-background"
        />
        <p className="text-sm text-muted-foreground mt-2">
          {targetRounds === 1 ? 'loadout' : 'loadouts'}
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Run dev server and verify Raid Prep tab**

Run: `cd app && npm run dev`
Expected: Raid Prep tab shows input field, typing changes the value

**Step 3: Commit**

```bash
git add app/src/components/Calculator/ResourceTree.tsx
git commit -m "feat: add RaidPrepDisplay component with target rounds input"
```

---

## Task 3: Pass Tab State to TreeNodeList and TreeNode

**Files:**
- Modify: `app/src/components/Calculator/ResourceTree.tsx:651-667` (TreeNodeList props)
- Modify: `app/src/components/Calculator/ResourceTree.tsx:686-702` (TreeNode props)

**Step 1: Update TreeNodeList props interface and component**

Update the TreeNodeList function signature (around line 651) to include new props:

```typescript
function TreeNodeList({
  nodes,
  expandedNodes,
  onToggle,
  depth,
  inventory,
  onInventoryChange,
  roundsCalculation,
  activeTab,
  targetRounds,
}: {
  nodes: ResourceNode[];
  expandedNodes: Set<string>;
  onToggle: (name: string) => void;
  depth: number;
  inventory: Record<string, string>;
  onInventoryChange: (name: string, value: string) => void;
  roundsCalculation: RoundsCalculationResult;
  activeTab: 'stash' | 'raid';
  targetRounds: number;
}) {
```

**Step 2: Pass props through TreeNodeList to TreeNode**

Update the TreeNode call inside TreeNodeList (around line 671-680):

```typescript
<TreeNode
  key={node.name}
  node={node}
  expandedNodes={expandedNodes}
  onToggle={onToggle}
  depth={depth}
  inventory={inventory}
  onInventoryChange={onInventoryChange}
  roundsCalculation={roundsCalculation}
  activeTab={activeTab}
  targetRounds={targetRounds}
/>
```

**Step 3: Update TreeNode props interface**

Update the TreeNode function signature (around line 686) to include new props:

```typescript
function TreeNode({
  node,
  expandedNodes,
  onToggle,
  depth,
  inventory,
  onInventoryChange,
  roundsCalculation,
  activeTab,
  targetRounds,
}: {
  node: ResourceNode;
  expandedNodes: Set<string>;
  onToggle: (name: string) => void;
  depth: number;
  inventory: Record<string, string>;
  onInventoryChange: (name: string, value: string) => void;
  roundsCalculation: RoundsCalculationResult;
  activeTab: 'stash' | 'raid';
  targetRounds: number;
}) {
```

**Step 4: Pass props through recursive TreeNodeList call**

Update the recursive TreeNodeList call at the bottom of TreeNode (around line 829-838):

```typescript
{isExpanded && node.children && (
  <TreeNodeList
    nodes={node.children}
    expandedNodes={expandedNodes}
    onToggle={onToggle}
    depth={depth + 1}
    inventory={inventory}
    onInventoryChange={onInventoryChange}
    roundsCalculation={roundsCalculation}
    activeTab={activeTab}
    targetRounds={targetRounds}
  />
)}
```

**Step 5: Update all TreeNodeList calls in ResourceTree component**

Find both TreeNodeList calls in the main component (around lines 513-522 and 536-545) and add the new props:

```typescript
<TreeNodeList
  nodes={itemTree}  // or 'tree' for the other call
  expandedNodes={expandedNodes}
  onToggle={toggleNode}
  depth={0}
  inventory={inventory}
  onInventoryChange={handleInventoryChange}
  roundsCalculation={roundsCalculation}
  activeTab={activeTab}
  targetRounds={targetRounds}
/>
```

**Step 6: Run dev server and verify no errors**

Run: `cd app && npm run dev`
Expected: No TypeScript errors, app renders normally

**Step 7: Commit**

```bash
git add app/src/components/Calculator/ResourceTree.tsx
git commit -m "feat: pass activeTab and targetRounds through tree components"
```

---

## Task 4: Conditionally Render TreeNode Elements Based on Tab

**Files:**
- Modify: `app/src/components/Calculator/ResourceTree.tsx:703-826` (TreeNode render)

**Step 1: Add display quantity calculation**

At the start of TreeNode (after the existing variable declarations around line 709), add:

```typescript
const displayQuantity = activeTab === 'raid' ? node.quantity * targetRounds : node.quantity;
```

**Step 2: Update quantity display**

Replace the quantity span (around line 751) from:

```typescript
<span className="w-10 text-right font-bold text-lg" style={{ color: rarityColor }}>
  {node.quantity}
</span>
```

To:

```typescript
<span className="w-10 text-right font-bold text-lg" style={{ color: rarityColor }}>
  {displayQuantity}
</span>
```

**Step 3: Conditionally render inventory input**

Wrap the inventory input section (around lines 756-781) with tab check. Replace:

```typescript
{/* Inventory input - fixed width, always reserve space */}
<div className="w-16 flex-shrink-0">
  {isLeaf ? (
    <input
      ...
    />
  ) : (
    <div className="w-full h-7" />
  )}
</div>
```

With:

```typescript
{/* Inventory input - fixed width, only show in Stash Check */}
{activeTab === 'stash' && (
  <div className="w-16 flex-shrink-0">
    {isLeaf ? (
      <input
        type="text"
        inputMode="numeric"
        value={inventory[node.name] || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value === '' || /^\d*$/.test(value)) {
            onInventoryChange(node.name, value);
          }
        }}
        placeholder="∞"
        className={cn(
          'w-full px-2 py-1 text-right text-sm rounded border bg-background',
          isBottleneck
            ? 'border-red-500 ring-1 ring-red-500/50'
            : 'border-border'
        )}
        aria-label={`Inventory amount for ${node.name}`}
        onClick={(e) => e.stopPropagation()}
      />
    ) : (
      <div className="w-full h-7" />
    )}
  </div>
)}
```

**Step 4: Conditionally render progress bar**

Wrap the progress bar section (around lines 783-806) with tab check. Replace:

```typescript
{/* Progress bar - fixed width, always reserve space */}
<div
  className="w-16 h-2 flex-shrink-0 bg-secondary rounded-full overflow-hidden"
  ...
>
  ...
</div>
```

With:

```typescript
{/* Progress bar - fixed width, only show in Stash Check */}
{activeTab === 'stash' && (
  <div
    className="w-16 h-2 flex-shrink-0 bg-secondary rounded-full overflow-hidden"
    title={isLeaf && roundsProvided !== null ? `${roundsProvided} rounds with this resource` : undefined}
  >
    {isLeaf && roundsProvided !== null && roundsCalculation.rounds !== null && roundsCalculation.rounds > 0 && (
      <div
        className={cn(
          'h-full transition-all',
          roundsProvided === 0
            ? 'bg-red-500'
            : isBottleneck
              ? 'bg-red-500'
              : (() => {
                  const headroom = ((roundsProvided - roundsCalculation.rounds) / roundsCalculation.rounds) * 100;
                  return headroom <= 25 ? 'bg-yellow-500' : 'bg-green-500';
                })()
        )}
        style={{
          width: `${isBottleneck ? 100 : Math.min(Math.max(((roundsProvided - roundsCalculation.rounds) / roundsCalculation.rounds) * 100, 10), 100)}%`
        }}
      />
    )}
  </div>
)}
```

**Step 5: Conditionally apply bottleneck highlight**

Update the row container className (around line 714-718). Replace:

```typescript
className={cn(
  'flex items-center gap-2 p-2 rounded-lg transition-all',
  isExpanded && 'bg-secondary/30',
  isBottleneck && 'bg-red-500/10'
)}
```

With:

```typescript
className={cn(
  'flex items-center gap-2 p-2 rounded-lg transition-all',
  isExpanded && 'bg-secondary/30',
  activeTab === 'stash' && isBottleneck && 'bg-red-500/10'
)}
```

**Step 6: Run dev server and verify tab differences**

Run: `cd app && npm run dev`
Expected:
- Stash Check tab shows inventory inputs and progress bars
- Raid Prep tab shows only quantities (scaled by target)
- Changing target in Raid Prep updates displayed quantities

**Step 7: Commit**

```bash
git add app/src/components/Calculator/ResourceTree.tsx
git commit -m "feat: conditionally render inventory inputs and progress bars based on active tab"
```

---

## Task 5: Update Final Materials Summary for Raid Prep

**Files:**
- Modify: `app/src/components/Calculator/ResourceTree.tsx:549-585` (Final Materials section)

**Step 1: Update quantity display in Final Materials summary**

In the Final Materials section (around line 579), change:

```typescript
<p className="text-lg font-bold text-primary">{data.quantity}</p>
```

To:

```typescript
<p className="text-lg font-bold text-primary">
  {activeTab === 'raid' ? data.quantity * targetRounds : data.quantity}
</p>
```

**Step 2: Run dev server and verify Final Materials scales**

Run: `cd app && npm run dev`
Expected: In Raid Prep tab, Final Materials quantities are multiplied by target

**Step 3: Commit**

```bash
git add app/src/components/Calculator/ResourceTree.tsx
git commit -m "feat: scale Final Materials summary quantities in Raid Prep tab"
```

---

## Task 6: Update Per-Item Grouped View for Raid Prep

**Files:**
- Modify: `app/src/components/Calculator/ResourceTree.tsx:485-527` (per-item view section)

**Step 1: Scale quantities in per-item grouped view**

The TreeNodeList in the per-item view already receives `targetRounds`, so quantities will scale automatically via the `displayQuantity` calculation added in Task 4.

However, we need to verify the itemTree uses the scaled values. The `buildTree` function uses base quantities, and scaling happens at display time in TreeNode.

**Step 2: Run dev server and verify grouped view scales**

Run: `cd app && npm run dev`
Expected: In Raid Prep tab with "Group by item" enabled, quantities are scaled

**Step 3: Commit (if any changes needed)**

If no changes were needed:
```bash
git commit --allow-empty -m "chore: verify per-item grouped view scales correctly in Raid Prep"
```

---

## Task 7: Final Testing and Edge Cases

**Files:**
- No file changes, just testing

**Step 1: Test Stash Check → Raid Prep carryover**

1. Select a loadout with some items
2. In Stash Check, enter inventory values for a few resources
3. Note the "X rounds possible" number
4. Click Raid Prep tab
5. Verify target input shows the same number

**Step 2: Test Raid Prep → Stash Check preservation**

1. In Raid Prep, change target to a different number
2. Click Stash Check tab
3. Verify inventory values are still there

**Step 3: Test edge cases**

1. Target = 0: All quantities show 0
2. Target = 1: Same as default
3. Empty/invalid target: Should default to 1

**Step 4: Test with expanded craftable items**

1. Click hammer icon to expand a craftable material
2. Switch between tabs
3. Verify expanded state persists and child quantities scale correctly

**Step 5: Run build to verify no TypeScript errors**

Run: `cd app && npm run build`
Expected: Build succeeds with no errors

**Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete Raid Prep tab implementation"
```

---

## Summary

After completing all tasks, the ResourceTree component will have:

1. Two tabs: "Stash Check" and "Raid Prep"
2. Stash Check: Current functionality (inventory inputs, rounds calculation, bottleneck)
3. Raid Prep: Target input that scales all displayed quantities
4. Tab switching carries over calculated rounds (Stash → Raid)
5. Shared features work in both tabs (expandable items, grouping, final summary)
