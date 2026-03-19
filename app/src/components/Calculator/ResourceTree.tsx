import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Hammer, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import {
  getItemById,
  getRarityColor,
  isCraftable,
  getItemRecipe,
  getWeapons,
} from '../../data/gameData';
import type { Loadout, GameItem, Locale, LocalizedString } from '../../types';

interface ResourceNode {
  id: string;
  name: LocalizedString;
  quantity: number;
  rarity: string | null;
  imageUrl: string | null;
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

/**
 * Walk backwards from the selected weapon through the upgrade chain to find
 * the tier 1 (base) weapon, then sum up: base weapon recipe + upgrade costs
 * for each intermediate tier up to the selected one.
 */
function getWeaponTotalCost(weaponId: string): Record<string, number> {
  const costs: Record<string, number> = {};

  // Build chain from tier 1 to selected tier
  const chain: GameItem[] = [];
  let current = getItemById(weaponId);
  while (current) {
    chain.unshift(current);
    // Find the weapon that upgrades TO this one
    const prev = getWeapons().find(w => w.upgradesTo === current!.id);
    current = prev;
  }

  // Base weapon recipe (tier 1)
  if (chain[0]?.recipe) {
    for (const [id, qty] of Object.entries(chain[0].recipe)) {
      costs[id] = (costs[id] ?? 0) + qty;
    }
  }

  // Add upgrade costs for each subsequent tier
  for (let i = 1; i < chain.length; i++) {
    if (chain[i].upgradeCost) {
      for (const [id, qty] of Object.entries(chain[i].upgradeCost!)) {
        costs[id] = (costs[id] ?? 0) + qty;
      }
    }
  }

  return costs;
}

export function ResourceTree({ loadout }: ResourceTreeProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;

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

  // Helper: add recipe ingredients to a resources map
  const addRecipe = (
    resources: Record<string, number>,
    recipe: Record<string, number>,
    multiplier = 1
  ) => {
    for (const [ingredientId, quantity] of Object.entries(recipe)) {
      resources[ingredientId] = (resources[ingredientId] ?? 0) + quantity * multiplier;
    }
  };

  // Calculate all resources needed from loadout
  const rawResources = useMemo(() => {
    const resources: Record<string, number> = {};

    // Weapon 1
    if (loadout.weapon1) {
      const weaponCost = getWeaponTotalCost(loadout.weapon1.id);
      addRecipe(resources, weaponCost);
      // Add mod materials
      for (const modId of loadout.weapon1.mods) {
        if (modId) {
          const mod = getItemById(modId);
          if (mod?.recipe) {
            addRecipe(resources, mod.recipe);
          }
        }
      }
    }

    // Weapon 2
    if (loadout.weapon2) {
      const weaponCost = getWeaponTotalCost(loadout.weapon2.id);
      addRecipe(resources, weaponCost);
      // Add mod materials
      for (const modId of loadout.weapon2.mods) {
        if (modId) {
          const mod = getItemById(modId);
          if (mod?.recipe) {
            addRecipe(resources, mod.recipe);
          }
        }
      }
    }

    // Augment
    if (loadout.augment) {
      const item = getItemById(loadout.augment);
      if (item?.recipe) addRecipe(resources, item.recipe);
    }

    // Shield
    if (loadout.shield) {
      const item = getItemById(loadout.shield);
      if (item?.recipe) addRecipe(resources, item.recipe);
    }

    // Healing
    for (const h of loadout.healing) {
      const item = getItemById(h.id);
      if (item?.recipe) addRecipe(resources, item.recipe, h.quantity);
    }

    // Grenades
    for (const g of loadout.grenades) {
      const item = getItemById(g.id);
      if (item?.recipe) addRecipe(resources, item.recipe, g.quantity);
    }

    // Utilities
    for (const u of loadout.utilities) {
      const item = getItemById(u.id);
      if (item?.recipe) addRecipe(resources, item.recipe, u.quantity);
    }

    // Traps
    for (const tr of loadout.traps) {
      const item = getItemById(tr.id);
      if (item?.recipe) addRecipe(resources, item.recipe, tr.quantity);
    }

    // Ammo
    for (const a of loadout.ammo) {
      const ammo = getItemById(a.type);
      if (ammo?.recipe) {
        // Calculate how many crafts needed based on craftQuantity
        const outputQty = ammo.craftQuantity || 1;
        const craftsNeeded = Math.ceil(a.quantity / outputQty);
        addRecipe(resources, ammo.recipe, craftsNeeded);
      }
    }

    return resources;
  }, [loadout]);

  // Calculate resources grouped by individual item
  const perItemResources = useMemo(() => {
    const items: ItemResources[] = [];

    // Weapon 1
    if (loadout.weapon1) {
      const weapon = getItemById(loadout.weapon1.id);
      if (weapon) {
        const resources = getWeaponTotalCost(loadout.weapon1.id);
        for (const modId of loadout.weapon1.mods) {
          if (modId) {
            const mod = getItemById(modId);
            if (mod?.recipe) addRecipe(resources, mod.recipe);
          }
        }
        items.push({ label: `${weapon.name[locale]} (${t('loadout.primaryWeapon')})`, resources });
      }
    }

    // Weapon 2
    if (loadout.weapon2) {
      const weapon = getItemById(loadout.weapon2.id);
      if (weapon) {
        const resources = getWeaponTotalCost(loadout.weapon2.id);
        for (const modId of loadout.weapon2.mods) {
          if (modId) {
            const mod = getItemById(modId);
            if (mod?.recipe) addRecipe(resources, mod.recipe);
          }
        }
        items.push({ label: `${weapon.name[locale]} (${t('loadout.secondaryWeapon')})`, resources });
      }
    }

    // Augment
    if (loadout.augment) {
      const item = getItemById(loadout.augment);
      if (item?.recipe) {
        const resources: Record<string, number> = {};
        addRecipe(resources, item.recipe);
        items.push({ label: item.name[locale], resources });
      }
    }

    // Shield
    if (loadout.shield) {
      const item = getItemById(loadout.shield);
      if (item?.recipe) {
        const resources: Record<string, number> = {};
        addRecipe(resources, item.recipe);
        items.push({ label: item.name[locale], resources });
      }
    }

    // Healing
    for (const h of loadout.healing) {
      const item = getItemById(h.id);
      if (item?.recipe) {
        const resources: Record<string, number> = {};
        addRecipe(resources, item.recipe, h.quantity);
        items.push({ label: `${item.name[locale]} x${h.quantity}`, resources });
      }
    }

    // Grenades
    for (const g of loadout.grenades) {
      const item = getItemById(g.id);
      if (item?.recipe) {
        const resources: Record<string, number> = {};
        addRecipe(resources, item.recipe, g.quantity);
        items.push({ label: `${item.name[locale]} x${g.quantity}`, resources });
      }
    }

    // Utilities
    for (const u of loadout.utilities) {
      const item = getItemById(u.id);
      if (item?.recipe) {
        const resources: Record<string, number> = {};
        addRecipe(resources, item.recipe, u.quantity);
        items.push({ label: `${item.name[locale]} x${u.quantity}`, resources });
      }
    }

    // Traps
    for (const tr of loadout.traps) {
      const item = getItemById(tr.id);
      if (item?.recipe) {
        const resources: Record<string, number> = {};
        addRecipe(resources, item.recipe, tr.quantity);
        items.push({ label: `${item.name[locale]} x${tr.quantity}`, resources });
      }
    }

    // Ammo
    for (const a of loadout.ammo) {
      const ammo = getItemById(a.type);
      if (ammo?.recipe) {
        const resources: Record<string, number> = {};
        const outputQty = ammo.craftQuantity || 1;
        const craftsNeeded = Math.ceil(a.quantity / outputQty);
        addRecipe(resources, ammo.recipe, craftsNeeded);
        items.push({ label: `${ammo.name[locale]} x${a.quantity}`, resources });
      }
    }

    return items;
  }, [loadout, locale, t]);

  // Build tree structure with expanded nodes broken down
  const buildTree = (
    resources: Record<string, number>,
    expanded: Set<string>,
    _depth = 0
  ): ResourceNode[] => {
    const nodes: ResourceNode[] = [];

    for (const [ingredientId, quantity] of Object.entries(resources)) {
      const item = getItemById(ingredientId);
      const canCraft = isCraftable(ingredientId);
      const isExpanded = expanded.has(ingredientId);

      const node: ResourceNode = {
        id: ingredientId,
        name: item?.name ?? { en: ingredientId, 'zh-CN': ingredientId },
        quantity,
        rarity: item?.rarity ?? null,
        imageUrl: item?.imageUrl ?? null,
        canCraft,
      };

      if (canCraft && isExpanded) {
        const recipe = getItemRecipe(ingredientId);
        if (recipe) {
          const craftsNeeded = Math.ceil(quantity / recipe.outputQuantity);
          const childResources: Record<string, number> = {};

          for (const [childId, childQty] of Object.entries(recipe.ingredients)) {
            childResources[childId] = childQty * craftsNeeded;
          }

          node.children = buildTree(childResources, expanded, _depth + 1);
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
      return a.name[locale].localeCompare(b.name[locale]);
    });
  };

  const tree = useMemo(
    () => buildTree(rawResources, expandedNodes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawResources, expandedNodes, locale]
  );

  // Calculate flat list of final materials (leaf nodes)
  const finalMaterials = useMemo(() => {
    const result: Record<string, { name: LocalizedString; quantity: number; rarity: string | null; imageUrl: string | null }> = {};

    const collectLeaves = (nodes: ResourceNode[]) => {
      for (const node of nodes) {
        if (node.children && node.children.length > 0) {
          collectLeaves(node.children);
        } else {
          if (!result[node.id]) {
            result[node.id] = { name: node.name, quantity: 0, rarity: node.rarity, imageUrl: node.imageUrl };
          }
          result[node.id].quantity += node.quantity;
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
          const current = leafMaterials.get(node.id) || 0;
          leafMaterials.set(node.id, current + node.quantity);
        }
      }
    };
    collectLeaves(tree);

    let minRounds = Infinity;
    let bottleneckResource: string | null = null;
    const resourceRounds: Map<string, number> = new Map();

    for (const [id, needed] of leafMaterials) {
      const invStr = inventory[id];
      // Empty or missing = infinite, skip
      if (!invStr || invStr === '') continue;

      const invAmount = parseInt(invStr, 10);
      if (isNaN(invAmount)) continue;

      const rounds = Math.floor(invAmount / needed);
      resourceRounds.set(id, rounds);

      if (rounds < minRounds) {
        minRounds = rounds;
        bottleneckResource = id;
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

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
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

  const handleInventoryChange = (id: string, value: string) => {
    // Only allow non-negative integers
    if (value !== '' && !/^\d*$/.test(value)) return;
    setInventory(prev => ({ ...prev, [id]: value }));
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
        <p>{t('resource.emptyState')}</p>
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
          {t('resource.stashCheck')}
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
          {t('resource.raidPrep')}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'stash' ? (
        <RoundsCalculatorDisplay
          rounds={roundsCalculation.rounds}
          bottleneck={roundsCalculation.bottleneck}
          hasAnyInput={roundsCalculation.hasAnyInput}
          onClear={clearInventory}
          locale={locale}
        />
      ) : (
        <RaidPrepDisplay
          targetRounds={targetRounds}
          onTargetChange={setTargetRounds}
        />
      )}

      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">{t('resource.title')}</h2>
          <HelpTooltip content={t('resource.helpCrafting')} />
        </div>
        <div className="flex items-center gap-2">
          <HelpTooltip content={t('resource.helpGroupBy')} />
          <span className="text-sm text-muted-foreground">{t('resource.groupByItem')}</span>
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
        </div>
      </div>

      {groupByItem ? (
        /* Per-item view */
        <div className="space-y-4">
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
                      locale={locale}
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
                locale={locale}
            />
          </div>

          {/* Summary list */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('resource.finalMaterials')}
            </h3>
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.entries(finalMaterials)
                  .sort((a, b) => {
                    // Match resource tree order: Legendary first, then alphabetical
                    const rarityOrder: Record<string, number> = {
                      'Legendary': 0, 'Epic': 1, 'Rare': 2, 'Uncommon': 3, 'Common': 4
                    };
                    const aOrder = rarityOrder[a[1].rarity || 'Common'] ?? 5;
                    const bOrder = rarityOrder[b[1].rarity || 'Common'] ?? 5;
                    if (aOrder !== bOrder) return aOrder - bOrder;
                    return a[1].name[locale].localeCompare(b[1].name[locale]);
                  })
                  .map(([id, data]) => (
                    <div
                      key={id}
                      className="flex items-center gap-2 p-2 rounded bg-secondary/50"
                      style={{ borderLeft: `3px solid ${getRarityColor(data.rarity)}` }}
                    >
                      {data.imageUrl && (
                        <img
                          src={data.imageUrl}
                          alt={data.name[locale]}
                          className="w-8 h-8 object-contain"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{data.name[locale]}</p>
                        <p className="text-lg font-bold text-primary">
                          {activeTab === 'raid' ? data.quantity * targetRounds : data.quantity}
                        </p>
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

// Help tooltip component
function HelpTooltip({ content }: { content: string }) {
  return (
    <div className="relative inline-flex group">
      <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50">
        <div className="bg-gray-900 text-gray-100 text-sm rounded-lg py-2 px-3 w-[320px] shadow-lg">
          {content}
        </div>
        <div className="absolute left-2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900" />
      </div>
    </div>
  );
}

// Rounds calculator display component
function RoundsCalculatorDisplay({
  rounds,
  bottleneck,
  hasAnyInput,
  onClear,
  locale,
}: {
  rounds: number | null;
  bottleneck: string | null;
  hasAnyInput: boolean;
  onClear: () => void;
  locale: Locale;
}) {
  const { t } = useTranslation();
  // Resolve bottleneck name for display
  const bottleneckName = bottleneck ? (getItemById(bottleneck)?.name[locale] ?? bottleneck) : null;

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{t('resource.stashCheck')}</h3>
          <HelpTooltip content={t('resource.helpStash')} />
        </div>
        <button
          onClick={onClear}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t('resource.clearAll')}
        </button>
      </div>

      <div className="text-center py-4">
        {!hasAnyInput ? (
          <p className="text-muted-foreground">
            {t('resource.stashPlaceholder')}
          </p>
        ) : (
          <>
            <div className="text-5xl font-bold text-primary mb-2">
              {rounds === null ? '∞' : rounds}
            </div>
            <p className="text-lg text-muted-foreground">
              {t('resource.roundsPossible')}
            </p>
            {bottleneckName && (
              <p className="text-sm text-red-400 mt-2">
                {t('resource.limitedBy', { bottleneck: bottleneckName })}
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
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold">{t('resource.raidPrep')}</h3>
        <HelpTooltip content={t('resource.helpRaidPrep')} />
      </div>
      <div className="text-center py-4">
        <label className="block text-muted-foreground mb-2">
          {t('resource.planLoadouts')}
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
          {t('resource.loadout', { count: targetRounds })}
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
  locale,
}: {
  nodes: ResourceNode[];
  expandedNodes: Set<string>;
  onToggle: (id: string) => void;
  depth: number;
  inventory: Record<string, string>;
  onInventoryChange: (id: string, value: string) => void;
  roundsCalculation: RoundsCalculationResult;
  activeTab: 'stash' | 'raid';
  targetRounds: number;
  locale: Locale;
}) {
  return (
    <div className={cn(depth > 0 && 'ml-6 pl-4 border-l-2 border-border')}>
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          expandedNodes={expandedNodes}
          onToggle={onToggle}
          depth={depth}
          inventory={inventory}
          onInventoryChange={onInventoryChange}
          roundsCalculation={roundsCalculation}
          activeTab={activeTab}
          targetRounds={targetRounds}
          locale={locale}
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
  locale,
}: {
  node: ResourceNode;
  expandedNodes: Set<string>;
  onToggle: (id: string) => void;
  depth: number;
  inventory: Record<string, string>;
  onInventoryChange: (id: string, value: string) => void;
  roundsCalculation: RoundsCalculationResult;
  activeTab: 'stash' | 'raid';
  targetRounds: number;
  locale: Locale;
}) {
  const { t } = useTranslation();
  const isExpanded = expandedNodes.has(node.id);
  const rarityColor = getRarityColor(node.rarity);
  const displayName = node.name[locale];

  // Show input only on leaf nodes (not expanded with children)
  const isLeaf = !node.children || node.children.length === 0;
  const isBottleneck = roundsCalculation.bottleneck === node.id;
  const roundsProvided = roundsCalculation.resourceRounds.get(node.id) ?? null;

  // Calculate display quantity based on active tab
  const displayQuantity = activeTab === 'raid' ? node.quantity * targetRounds : node.quantity;

  return (
    <div className="py-1">
      <div
        className={cn(
          'flex items-center gap-2 p-2 rounded-lg transition-all',
          isExpanded && 'bg-secondary/30',
          activeTab === 'stash' && isBottleneck && 'bg-red-500/10'
        )}
        style={{ borderLeft: `3px solid ${rarityColor}` }}
      >
        {/* Chevron - fixed width, clickable */}
        <span
          className={cn(
            'w-5 h-5 flex-shrink-0 flex items-center justify-center text-muted-foreground select-none',
            node.canCraft && 'cursor-pointer hover:text-foreground'
          )}
          onClick={() => node.canCraft && onToggle(node.id)}
        >
          {node.canCraft ? (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : null}
        </span>

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

        {/* Right-side controls with fixed widths */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Quantity needed - fixed width */}
          <span className="w-10 text-right font-bold text-lg" style={{ color: rarityColor }}>
            {displayQuantity}
          </span>

          {/* Inventory input - fixed width, only show in Stash Check */}
          {activeTab === 'stash' && (
            <div className="w-16 flex-shrink-0">
              {isLeaf ? (
                <input
                  type="text"
                  inputMode="numeric"
                  value={inventory[node.id] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*$/.test(value)) {
                      onInventoryChange(node.id, value);
                    }
                  }}
                  placeholder="∞"
                  className={cn(
                    'w-full px-2 py-1 text-right text-sm rounded border bg-background',
                    isBottleneck
                      ? 'border-red-500 ring-1 ring-red-500/50'
                      : 'border-border'
                  )}
                  aria-label={`Inventory amount for ${displayName}`}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="w-full h-7" />
              )}
            </div>
          )}

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
                title={isExpanded ? t('resource.collapse') : t('resource.breakDown')}
                onClick={() => onToggle(node.id)}
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
          locale={locale}
        />
      )}
    </div>
  );
}
