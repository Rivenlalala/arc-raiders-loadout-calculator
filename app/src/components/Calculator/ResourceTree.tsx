import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Hammer } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  getWeaponById,
  getEquipmentById,
  getModificationById,
  getMaterialByName,
  getAmmoByName,
  getRarityColor,
  isCraftable,
  getMaterialRecipe,
} from '../../data/gameData';
import type { Loadout, CraftingMaterial } from '../../types';

interface ResourceNode {
  name: string;
  quantity: number;
  rarity: string | null;
  image: string | null;
  canCraft: boolean;
  children?: ResourceNode[];
}

interface ItemResources {
  label: string;
  resources: Record<string, number>;
}

interface ResourceTreeProps {
  loadout: Loadout;
}

export function ResourceTree({ loadout }: ResourceTreeProps) {
  // Track which nodes are expanded (crafted down)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  // Toggle for per-item grouping
  const [groupByItem, setGroupByItem] = useState(false);
  // Track which item blocks are collapsed
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set());
  // Track inventory amounts for rounds calculation
  const [inventory, setInventory] = useState<Record<string, string>>({});
  // Tab state: 'stash' for Stash Check, 'raid' for Raid Prep
  const [activeTab, setActiveTab] = useState<'stash' | 'raid'>('stash');
  // Target rounds for Raid Prep tab
  const [targetRounds, setTargetRounds] = useState<number>(1);

  // Calculate all resources needed from loadout
  const rawResources = useMemo(() => {
    const resources: Record<string, number> = {};

    const addMaterials = (materials: CraftingMaterial[], multiplier = 1) => {
      for (const mat of materials) {
        resources[mat.material] = (resources[mat.material] || 0) + mat.quantity * multiplier;
      }
    };

    // Weapon 1
    if (loadout.weapon1) {
      const weapon = getWeaponById(loadout.weapon1.id);
      if (weapon) {
        addMaterials(weapon.crafting.materials);
        // Add upgrade materials
        const targetTier = loadout.weapon1.tier || 1;
        for (let i = 0; i < targetTier - 1 && i < weapon.crafting.upgrades.length; i++) {
          addMaterials(weapon.crafting.upgrades[i].materials);
        }
        // Add mod materials
        for (const modId of loadout.weapon1.mods) {
          if (modId) {
            const mod = getModificationById(modId);
            if (mod) {
              addMaterials(mod.crafting.materials);
            }
          }
        }
      }
    }

    // Weapon 2
    if (loadout.weapon2) {
      const weapon = getWeaponById(loadout.weapon2.id);
      if (weapon) {
        addMaterials(weapon.crafting.materials);
        const targetTier = loadout.weapon2.tier || 1;
        for (let i = 0; i < targetTier - 1 && i < weapon.crafting.upgrades.length; i++) {
          addMaterials(weapon.crafting.upgrades[i].materials);
        }
        // Add mod materials
        for (const modId of loadout.weapon2.mods) {
          if (modId) {
            const mod = getModificationById(modId);
            if (mod) {
              addMaterials(mod.crafting.materials);
            }
          }
        }
      }
    }

    // Augment
    if (loadout.augment) {
      const item = getEquipmentById(loadout.augment);
      if (item) addMaterials(item.crafting.materials);
    }

    // Shield
    if (loadout.shield) {
      const item = getEquipmentById(loadout.shield);
      if (item) addMaterials(item.crafting.materials);
    }

    // Healing
    for (const h of loadout.healing) {
      const item = getEquipmentById(h.id);
      if (item) addMaterials(item.crafting.materials, h.quantity);
    }

    // Grenades
    for (const g of loadout.grenades) {
      const item = getEquipmentById(g.id);
      if (item) addMaterials(item.crafting.materials, g.quantity);
    }

    // Utilities
    for (const u of loadout.utilities) {
      const item = getEquipmentById(u.id);
      if (item) addMaterials(item.crafting.materials, u.quantity);
    }

    // Traps
    for (const t of loadout.traps) {
      const item = getEquipmentById(t.id);
      if (item) addMaterials(item.crafting.materials, t.quantity);
    }

    // Ammo
    for (const a of loadout.ammo) {
      const ammo = getAmmoByName(a.type);
      if (ammo) {
        // Calculate how many crafts needed based on output_quantity
        const outputQty = ammo.crafting.output_quantity || 1;
        const craftsNeeded = Math.ceil(a.quantity / outputQty);
        addMaterials(ammo.crafting.materials, craftsNeeded);
      }
    }

    return resources;
  }, [loadout]);

  // Calculate resources grouped by individual item
  const perItemResources = useMemo(() => {
    const items: ItemResources[] = [];

    const addMaterials = (
      resources: Record<string, number>,
      materials: CraftingMaterial[],
      multiplier = 1
    ) => {
      for (const mat of materials) {
        resources[mat.material] = (resources[mat.material] || 0) + mat.quantity * multiplier;
      }
    };

    // Weapon 1
    if (loadout.weapon1) {
      const weapon = getWeaponById(loadout.weapon1.id);
      if (weapon) {
        const resources: Record<string, number> = {};
        addMaterials(resources, weapon.crafting.materials);
        const targetTier = loadout.weapon1.tier || 1;
        for (let i = 0; i < targetTier - 1 && i < weapon.crafting.upgrades.length; i++) {
          addMaterials(resources, weapon.crafting.upgrades[i].materials);
        }
        for (const modId of loadout.weapon1.mods) {
          if (modId) {
            const mod = getModificationById(modId);
            if (mod) {
              addMaterials(resources, mod.crafting.materials);
            }
          }
        }
        items.push({ label: `${weapon.name} (Primary)`, resources });
      }
    }

    // Weapon 2
    if (loadout.weapon2) {
      const weapon = getWeaponById(loadout.weapon2.id);
      if (weapon) {
        const resources: Record<string, number> = {};
        addMaterials(resources, weapon.crafting.materials);
        const targetTier = loadout.weapon2.tier || 1;
        for (let i = 0; i < targetTier - 1 && i < weapon.crafting.upgrades.length; i++) {
          addMaterials(resources, weapon.crafting.upgrades[i].materials);
        }
        for (const modId of loadout.weapon2.mods) {
          if (modId) {
            const mod = getModificationById(modId);
            if (mod) {
              addMaterials(resources, mod.crafting.materials);
            }
          }
        }
        items.push({ label: `${weapon.name} (Secondary)`, resources });
      }
    }

    // Augment
    if (loadout.augment) {
      const item = getEquipmentById(loadout.augment);
      if (item) {
        const resources: Record<string, number> = {};
        addMaterials(resources, item.crafting.materials);
        items.push({ label: item.name, resources });
      }
    }

    // Shield
    if (loadout.shield) {
      const item = getEquipmentById(loadout.shield);
      if (item) {
        const resources: Record<string, number> = {};
        addMaterials(resources, item.crafting.materials);
        items.push({ label: item.name, resources });
      }
    }

    // Healing
    for (const h of loadout.healing) {
      const item = getEquipmentById(h.id);
      if (item) {
        const resources: Record<string, number> = {};
        addMaterials(resources, item.crafting.materials, h.quantity);
        items.push({ label: `${item.name} x${h.quantity}`, resources });
      }
    }

    // Grenades
    for (const g of loadout.grenades) {
      const item = getEquipmentById(g.id);
      if (item) {
        const resources: Record<string, number> = {};
        addMaterials(resources, item.crafting.materials, g.quantity);
        items.push({ label: `${item.name} x${g.quantity}`, resources });
      }
    }

    // Utilities
    for (const u of loadout.utilities) {
      const item = getEquipmentById(u.id);
      if (item) {
        const resources: Record<string, number> = {};
        addMaterials(resources, item.crafting.materials, u.quantity);
        items.push({ label: `${item.name} x${u.quantity}`, resources });
      }
    }

    // Traps
    for (const t of loadout.traps) {
      const item = getEquipmentById(t.id);
      if (item) {
        const resources: Record<string, number> = {};
        addMaterials(resources, item.crafting.materials, t.quantity);
        items.push({ label: `${item.name} x${t.quantity}`, resources });
      }
    }

    // Ammo
    for (const a of loadout.ammo) {
      const ammo = getAmmoByName(a.type);
      if (ammo) {
        const resources: Record<string, number> = {};
        const outputQty = ammo.crafting.output_quantity || 1;
        const craftsNeeded = Math.ceil(a.quantity / outputQty);
        addMaterials(resources, ammo.crafting.materials, craftsNeeded);
        items.push({ label: `${ammo.name} x${a.quantity}`, resources });
      }
    }

    return items;
  }, [loadout]);

  // Build tree structure with expanded nodes broken down
  const buildTree = (
    resources: Record<string, number>,
    expanded: Set<string>,
    depth = 0
  ): ResourceNode[] => {
    const nodes: ResourceNode[] = [];

    for (const [name, quantity] of Object.entries(resources)) {
      const material = getMaterialByName(name);
      const canCraft = isCraftable(name);
      const isExpanded = expanded.has(name);

      const node: ResourceNode = {
        name,
        quantity,
        rarity: material?.rarity ?? null,
        image: material?.image ?? null,
        canCraft,
      };

      if (canCraft && isExpanded) {
        const recipe = getMaterialRecipe(name);
        if (recipe) {
          const craftsNeeded = Math.ceil(quantity / recipe.outputQuantity);
          const childResources: Record<string, number> = {};

          for (const mat of recipe.materials) {
            childResources[mat.material] = mat.quantity * craftsNeeded;
          }

          node.children = buildTree(childResources, expanded, depth + 1);
        }
      }

      nodes.push(node);
    }

    // Sort by rarity (legendary first) then name
    const rarityOrder: Record<string, number> = {
      legendary: 0,
      epic: 1,
      rare: 2,
      uncommon: 3,
      common: 4,
    };

    return nodes.sort((a, b) => {
      const aOrder = rarityOrder[(a.rarity ?? 'common').toLowerCase()] ?? 5;
      const bOrder = rarityOrder[(b.rarity ?? 'common').toLowerCase()] ?? 5;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.name.localeCompare(b.name);
    });
  };

  const tree = useMemo(
    () => buildTree(rawResources, expandedNodes),
    [rawResources, expandedNodes]
  );

  // Calculate flat list of final materials (leaf nodes)
  const finalMaterials = useMemo(() => {
    const result: Record<string, { quantity: number; rarity: string | null; image: string | null }> = {};

    const collectLeaves = (nodes: ResourceNode[]) => {
      for (const node of nodes) {
        if (node.children && node.children.length > 0) {
          collectLeaves(node.children);
        } else {
          if (!result[node.name]) {
            result[node.name] = { quantity: 0, rarity: node.rarity, image: node.image };
          }
          result[node.name].quantity += node.quantity;
        }
      }
    };

    collectLeaves(tree);
    return result;
  }, [tree]);

  // Calculate rounds possible based on inventory
  const roundsCalculation = useMemo(() => {
    const leafMaterials = new Map<string, number>();

    // Collect leaf materials from tree (follows expansion state)
    const collectLeaves = (nodes: ResourceNode[]) => {
      for (const node of nodes) {
        if (node.children && node.children.length > 0) {
          collectLeaves(node.children);
        } else {
          const current = leafMaterials.get(node.name) || 0;
          leafMaterials.set(node.name, current + node.quantity);
        }
      }
    };
    collectLeaves(tree);

    let minRounds = Infinity;
    let bottleneckResource: string | null = null;
    const resourceRounds: Map<string, number> = new Map();

    for (const [name, needed] of leafMaterials) {
      const invStr = inventory[name];
      // Empty or missing = infinite, skip
      if (!invStr || invStr === '') continue;

      const invAmount = parseInt(invStr, 10);
      if (isNaN(invAmount)) continue;

      const rounds = Math.floor(invAmount / needed);
      resourceRounds.set(name, rounds);

      if (rounds < minRounds) {
        minRounds = rounds;
        bottleneckResource = name;
      }
    }

    return {
      rounds: minRounds === Infinity ? null : minRounds,
      bottleneck: bottleneckResource,
      resourceRounds,
      leafMaterials,
      hasAnyInput: resourceRounds.size > 0
    };
  }, [tree, inventory]);

  const toggleNode = (name: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const toggleBlock = (label: string) => {
    setCollapsedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const handleInventoryChange = (name: string, value: string) => {
    // Only allow non-negative integers
    if (value !== '' && !/^\d*$/.test(value)) return;
    setInventory(prev => ({ ...prev, [name]: value }));
  };

  const clearInventory = () => setInventory({});

  const handleTabSwitch = (tab: 'stash' | 'raid') => {
    if (tab === 'raid' && activeTab === 'stash') {
      // Switching to Raid Prep: carry over calculated rounds
      if (roundsCalculation.rounds !== null) {
        setTargetRounds(roundsCalculation.rounds);
      }
    }
    setActiveTab(tab);
  };

  const isEmpty = Object.keys(rawResources).length === 0;

  if (isEmpty) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Select items in your loadout to see required resources</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Required Resources</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-muted-foreground">Group by item</span>
          <button
            type="button"
            role="switch"
            aria-checked={groupByItem}
            onClick={() => setGroupByItem(!groupByItem)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              groupByItem ? 'bg-primary' : 'bg-secondary'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                groupByItem ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </label>
      </div>

      {groupByItem ? (
        /* Per-item view */
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Resources by Item (click craftable items to break down)
          </h3>
          {perItemResources.map((item) => {
            const isCollapsed = collapsedBlocks.has(item.label);
            const itemTree = buildTree(item.resources, expandedNodes);
            return (
              <div
                key={item.label}
                className="bg-card rounded-lg border border-border overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleBlock(item.label)}
                  className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                >
                  <span className="font-semibold text-lg">{item.label}</span>
                  {isCollapsed ? (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                {!isCollapsed && (
                  <div className="px-4 pb-4">
                    <TreeNodeList
                      nodes={itemTree}
                      expandedNodes={expandedNodes}
                      onToggle={toggleNode}
                      depth={0}
                      inventory={inventory}
                      onInventoryChange={handleInventoryChange}
                      roundsCalculation={roundsCalculation}
                      activeTab={activeTab}
                      targetRounds={targetRounds}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {/* Tree view */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Resource Tree (click craftable items to break down)
            </h3>
            <div className="bg-card rounded-lg p-4 border border-border">
              <TreeNodeList
                nodes={tree}
                expandedNodes={expandedNodes}
                onToggle={toggleNode}
                depth={0}
                inventory={inventory}
                onInventoryChange={handleInventoryChange}
                roundsCalculation={roundsCalculation}
                activeTab={activeTab}
                targetRounds={targetRounds}
              />
            </div>
          </div>

          {/* Summary list */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Final Materials Needed
            </h3>
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.entries(finalMaterials)
                  .sort((a, b) => {
                    const rarityOrder: Record<string, number> = {
                      'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Epic': 4, 'Legendary': 5
                    };
                    const aOrder = rarityOrder[a[1].rarity || 'Common'] || 0;
                    const bOrder = rarityOrder[b[1].rarity || 'Common'] || 0;
                    return aOrder - bOrder;
                  })
                  .map(([name, data]) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 p-2 rounded bg-secondary/50"
                      style={{ borderLeft: `3px solid ${getRarityColor(data.rarity)}` }}
                    >
                      {data.image && (
                        <img
                          src={`/${data.image}`}
                          alt={name}
                          className="w-8 h-8 object-contain"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{name}</p>
                        <p className="text-lg font-bold text-primary">{data.quantity}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Rounds calculator display component
function RoundsCalculatorDisplay({
  rounds,
  bottleneck,
  hasAnyInput,
  onClear,
}: {
  rounds: number | null;
  bottleneck: string | null;
  hasAnyInput: boolean;
  onClear: () => void;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Rounds Calculator</h3>
        <button
          onClick={onClear}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="text-center py-4">
        {!hasAnyInput ? (
          <p className="text-muted-foreground">
            Enter inventory amounts below to calculate how many rounds you can craft
          </p>
        ) : (
          <>
            <div className="text-5xl font-bold text-primary mb-2">
              {rounds === null ? '∞' : rounds}
            </div>
            <p className="text-lg text-muted-foreground">
              rounds possible
            </p>
            {bottleneck && (
              <p className="text-sm text-red-400 mt-2">
                Limited by: {bottleneck}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

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
            onTargetChange(isNaN(val) || val < 0 ? 1 : val);
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

// Type for rounds calculation result
interface RoundsCalculationResult {
  rounds: number | null;
  bottleneck: string | null;
  resourceRounds: Map<string, number>;
  leafMaterials: Map<string, number>;
  hasAnyInput: boolean;
}

// Recursive tree node list component
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
  return (
    <div className={cn(depth > 0 && 'ml-6 pl-4 border-l-2 border-border')}>
      {nodes.map((node) => (
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
      ))}
    </div>
  );
}

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
  const isExpanded = expandedNodes.has(node.name);
  const rarityColor = getRarityColor(node.rarity);

  // Show input only on leaf nodes (not expanded with children)
  const isLeaf = !node.children || node.children.length === 0;
  const isBottleneck = roundsCalculation.bottleneck === node.name;
  const roundsProvided = roundsCalculation.resourceRounds.get(node.name) ?? null;

  return (
    <div className="py-1">
      <div
        className={cn(
          'flex items-center gap-2 p-2 rounded-lg transition-all',
          isExpanded && 'bg-secondary/30',
          isBottleneck && 'bg-red-500/10'
        )}
        style={{ borderLeft: `3px solid ${rarityColor}` }}
      >
        {/* Chevron - fixed width, clickable */}
        <span
          className={cn(
            'w-5 h-5 flex-shrink-0 flex items-center justify-center text-muted-foreground select-none',
            node.canCraft && 'cursor-pointer hover:text-foreground'
          )}
          onClick={() => node.canCraft && onToggle(node.name)}
        >
          {node.canCraft ? (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : null}
        </span>

        {/* Image - fixed width */}
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
          {node.image && (
            <img
              src={`/${node.image}`}
              alt={node.name}
              className="w-8 h-8 object-contain"
            />
          )}
        </div>

        {/* Name - flexible */}
        <span className="flex-1 font-medium min-w-0 truncate">{node.name}</span>

        {/* Right-side controls with fixed widths */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Quantity needed - fixed width */}
          <span className="w-10 text-right font-bold text-lg" style={{ color: rarityColor }}>
            {node.quantity}
          </span>

          {/* Inventory input - fixed width, always reserve space */}
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

          {/* Progress bar - fixed width, always reserve space */}
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

          {/* Hammer icon - fixed width, always reserve space */}
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
            {node.canCraft && (
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer select-none',
                  isExpanded
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'border-2 border-dashed border-primary/50 text-primary hover:border-primary hover:bg-primary/10'
                )}
                title={isExpanded ? "Click to collapse" : "Click to break down into components"}
                onClick={() => onToggle(node.name)}
              >
                <Hammer className={cn('w-5 h-5', !isExpanded && 'animate-pulse')} />
              </div>
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
}
