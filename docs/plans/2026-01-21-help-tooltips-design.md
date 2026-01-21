# Help Tooltips Design

Add help tooltips (? icons) throughout the resource calculator to help new users understand features.

## Overview

New users may not understand the Stash Check / Raid Prep tabs, the hammer breakdown feature, or the group toggle. Adding contextual help tooltips provides discoverability without cluttering the UI.

## Tooltip Component

**Implementation:**
- Reusable `HelpTooltip` component
- Uses `HelpCircle` icon from lucide-react (w-4 h-4)
- Tooltip appears on hover, positioned relative to icon
- CSS-only hover implementation (no JavaScript state needed)

**Styling:**
- Icon: Muted color (`text-muted-foreground`), subtle hover effect
- Tooltip: Dark background (`bg-gray-900`), light text, rounded corners, max-width ~250px, slight shadow
- Position: Above or to the right of the icon depending on context

## Tooltip Placements & Content

### 1. Stash Check Card
**Position:** Next to "Rounds Calculator" header

**Content:**
> "Enter your current inventory amounts in the input boxes below. Leave empty for unlimited (won't limit your rounds). The calculator shows how many complete loadouts you can craft. Resources highlighted in red are your bottleneck. Progress bars show how much surplus you have of each material."

### 2. Raid Prep Card
**Position:** Next to "Raid Prep" header

**Content:**
> "Enter how many loadouts you want to prepare. All material quantities will scale automatically so you know exactly what to gather."

### 3. Required Resources Section
**Position:** Next to "Required Resources" header

**Content:**
> "Click the hammer icon on any craftable material to break it down into its base components."

### 4. Group by Item Toggle
**Position:** Next to the toggle label

**Content:**
> "Toggle to see resources grouped by each item in your loadout, or combined into a single list."

## UI Cleanup

Remove redundant instructional subheadings:
- Remove: "Resources by Item (click craftable items to break down)"
- Remove: "Resource Tree (click craftable items to break down)"

These are replaced by the Required Resources tooltip.

## Files to Modify

- `app/src/components/Calculator/ResourceTree.tsx`
  - Add HelpTooltip component
  - Add tooltips to 4 locations
  - Remove subheading text

## Component Structure

```typescript
function HelpTooltip({ content }: { content: string }) {
  return (
    <div className="relative inline-block group">
      <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
      <div className="absolute hidden group-hover:block ...">
        {content}
      </div>
    </div>
  );
}
```
