import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Hammer } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  getWeaponById,
  getEquipmentById,
  getModificationById,
  getMaterialByName,
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

interface ResourceTreeProps {
  loadout: Loadout;
}

export function ResourceTree({ loadout }: ResourceTreeProps) {
  // Track which nodes are expanded (crafted down)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

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

    return resources;
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
      <h2 className="text-xl font-bold">Required Resources</h2>

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
              .sort((a, b) => b[1].quantity - a[1].quantity)
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
    </div>
  );
}

// Recursive tree node list component
function TreeNodeList({
  nodes,
  expandedNodes,
  onToggle,
  depth,
}: {
  nodes: ResourceNode[];
  expandedNodes: Set<string>;
  onToggle: (name: string) => void;
  depth: number;
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
}: {
  node: ResourceNode;
  expandedNodes: Set<string>;
  onToggle: (name: string) => void;
  depth: number;
}) {
  const isExpanded = expandedNodes.has(node.name);
  const rarityColor = getRarityColor(node.rarity);

  return (
    <div className="py-1">
      <div
        className={cn(
          'flex items-center gap-2 p-2 rounded-lg transition-all',
          'hover:bg-secondary/50',
          node.canCraft && 'cursor-pointer',
          isExpanded && 'bg-secondary/30'
        )}
        style={{ borderLeft: `3px solid ${rarityColor}` }}
        onClick={() => node.canCraft && onToggle(node.name)}
      >
        {node.canCraft ? (
          <span className="w-5 h-5 flex items-center justify-center text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        ) : (
          <span className="w-5 h-5" />
        )}

        {node.image && (
          <img
            src={`/${node.image}`}
            alt={node.name}
            className="w-8 h-8 object-contain"
          />
        )}

        <span className="flex-1 font-medium">{node.name}</span>

        <span className="font-bold text-lg" style={{ color: rarityColor }}>
          {node.quantity}
        </span>

        {node.canCraft && (
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg transition-all',
              isExpanded
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'border-2 border-dashed border-primary/50 text-primary hover:border-primary hover:bg-primary/10'
            )}
            title={isExpanded ? "Click to collapse" : "Click to break down into components"}
          >
            <Hammer className={cn('w-5 h-5', !isExpanded && 'animate-pulse')} />
          </div>
        )}
      </div>

      {isExpanded && node.children && (
        <TreeNodeList
          nodes={node.children}
          expandedNodes={expandedNodes}
          onToggle={onToggle}
          depth={depth + 1}
        />
      )}
    </div>
  );
}
