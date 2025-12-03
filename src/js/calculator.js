/**
 * Resource Calculator Module
 * Calculates total resources needed for a loadout
 */

const Calculator = {
    // Cache for material recipes
    materialRecipes: null,

    /**
     * Initialize material recipes cache
     */
    initMaterialRecipes() {
        if (this.materialRecipes) return;

        this.materialRecipes = {};
        const materials = GameData.getMaterials();
        for (const mat of materials) {
            if (mat.crafting?.materials?.length > 0) {
                this.materialRecipes[mat.name.toLowerCase()] = {
                    materials: mat.crafting.materials,
                    output: mat.crafting.output_quantity || 1
                };
            }
        }
    },

    /**
     * Calculate resources for a complete loadout
     * @param {Object} loadout - The loadout configuration
     * @param {boolean} breakdownMaterials - If true, break down craftable materials to base components
     */
    calculateLoadout(loadout, breakdownMaterials = false) {
        this.initMaterialRecipes();
        const resources = {};

        // Calculate weapon resources
        if (loadout.weapon1) {
            this.addWeaponResources(resources, loadout.weapon1);
        }
        if (loadout.weapon2) {
            this.addWeaponResources(resources, loadout.weapon2);
        }

        // Calculate augment resources
        if (loadout.augment) {
            this.addItemResources(resources, loadout.augment);
        }

        // Calculate shield resources
        if (loadout.shield) {
            this.addItemResources(resources, loadout.shield);
        }

        // Calculate utility resources
        for (const utility of loadout.utilities || []) {
            this.addItemResources(resources, utility.item, utility.quantity);
        }

        // Calculate grenade resources
        for (const grenade of loadout.grenades || []) {
            this.addItemResources(resources, grenade.item, grenade.quantity);
        }

        // Calculate healing resources
        for (const healing of loadout.healing || []) {
            this.addItemResources(resources, healing.item, healing.quantity);
        }

        // Calculate ammo resources
        for (const ammo of loadout.ammo || []) {
            if (ammo.quantity > 0) {
                this.addAmmoResources(resources, ammo.type, ammo.quantity);
            }
        }

        // Calculate modification resources
        for (const mod of loadout.mods || []) {
            this.addItemResources(resources, mod);
        }

        // Optionally break down craftable materials to base components
        if (breakdownMaterials) {
            return this.groupResources(this.breakdownToBase(resources));
        }

        return this.groupResources(resources);
    },

    /**
     * Break down all craftable materials to their base components
     */
    breakdownToBase(resources) {
        const baseResources = {};
        const maxIterations = 10; // Prevent infinite loops

        // Copy resources and track what needs processing
        let toProcess = { ...resources };

        for (let iteration = 0; iteration < maxIterations; iteration++) {
            const nextToProcess = {};
            let hadBreakdown = false;

            for (const [key, resource] of Object.entries(toProcess)) {
                const recipe = this.materialRecipes[key];

                if (recipe) {
                    // This material can be crafted - break it down
                    hadBreakdown = true;
                    const craftsNeeded = Math.ceil(resource.quantity / recipe.output);

                    for (const ingredient of recipe.materials) {
                        const ingKey = ingredient.material.toLowerCase();
                        const ingQty = ingredient.quantity * craftsNeeded;

                        if (!nextToProcess[ingKey]) {
                            nextToProcess[ingKey] = {
                                name: ingredient.material,
                                quantity: 0,
                                category: this.getMaterialCategory(ingredient.material)
                            };
                        }
                        nextToProcess[ingKey].quantity += ingQty;
                    }
                } else {
                    // Base material - add to final result
                    if (!baseResources[key]) {
                        baseResources[key] = {
                            name: resource.name,
                            quantity: 0,
                            category: resource.category
                        };
                    }
                    baseResources[key].quantity += resource.quantity;
                }
            }

            if (!hadBreakdown) break;
            toProcess = nextToProcess;
        }

        // Add any remaining items from toProcess to baseResources
        for (const [key, resource] of Object.entries(toProcess)) {
            if (!baseResources[key]) {
                baseResources[key] = resource;
            } else {
                baseResources[key].quantity += resource.quantity;
            }
        }

        return baseResources;
    },

    /**
     * Add weapon crafting resources (base + upgrades to specified tier)
     */
    addWeaponResources(resources, weaponConfig) {
        const weapon = GameData.getWeaponById(weaponConfig.id);
        if (!weapon) return;

        // Add base crafting materials
        if (weapon.crafting?.tier1?.materials) {
            for (const mat of weapon.crafting.tier1.materials) {
                this.addResource(resources, mat.material, mat.quantity);
            }
        }

        // Add upgrade materials up to selected tier
        const targetTier = weaponConfig.tier || 1;
        if (targetTier > 1 && weapon.crafting?.upgrades) {
            for (let i = 0; i < targetTier - 1 && i < weapon.crafting.upgrades.length; i++) {
                const upgrade = weapon.crafting.upgrades[i];
                for (const mat of upgrade.materials || []) {
                    this.addResource(resources, mat.material, mat.quantity);
                }
            }
        }
    },

    /**
     * Add item crafting resources
     */
    addItemResources(resources, item, quantity = 1) {
        if (!item?.crafting?.materials) return;

        for (const mat of item.crafting.materials) {
            this.addResource(resources, mat.material, mat.quantity * quantity);
        }
    },

    /**
     * Add ammo crafting resources
     */
    addAmmoResources(resources, ammoType, quantity) {
        const ammo = GameData.getAmmoByType(ammoType);
        if (!ammo?.crafting?.materials) return;

        // Calculate how many crafts needed
        const outputPerCraft = ammo.crafting.output_quantity || 1;
        const craftsNeeded = Math.ceil(quantity / outputPerCraft);

        for (const mat of ammo.crafting.materials) {
            this.addResource(resources, mat.material, mat.quantity * craftsNeeded);
        }
    },

    /**
     * Add a resource to the totals
     */
    addResource(resources, material, quantity) {
        const key = material.toLowerCase();
        if (!resources[key]) {
            resources[key] = {
                name: material,
                quantity: 0,
                category: this.getMaterialCategory(material)
            };
        }
        resources[key].quantity += quantity;
    },

    /**
     * Determine the category of a material
     */
    getMaterialCategory(material) {
        const matLower = material.toLowerCase();

        // Base materials
        if (['metal parts', 'plastic parts', 'rubber parts', 'wires', 'duct tape',
             'chemicals', 'oil', 'fabric', 'rope', 'battery'].some(m => matLower.includes(m))) {
            return 'Base Materials';
        }

        // Refined materials
        if (matLower.includes('mechanical components') || matLower.includes('mod components') ||
            matLower.includes('explosive') || matLower.includes('steel spring')) {
            return 'Refined Materials';
        }

        // Gun parts
        if (matLower.includes('gun parts')) {
            return 'Gun Parts';
        }

        // ARC materials
        if (matLower.includes('arc ')) {
            return 'ARC Materials';
        }

        // Special materials
        if (matLower.includes('magnetic') || matLower.includes('exodus') ||
            matLower.includes('reactor') || matLower.includes('voltage') ||
            matLower.includes('power rod') || matLower.includes('canister') ||
            matLower.includes('magnet')) {
            return 'Special Materials';
        }

        return 'Other Materials';
    },

    /**
     * Group resources by category for display
     */
    groupResources(resources) {
        const grouped = {};

        for (const [key, resource] of Object.entries(resources)) {
            const category = resource.category;
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push({
                name: resource.name,
                quantity: resource.quantity
            });
        }

        // Sort resources within each category by name
        for (const category of Object.keys(grouped)) {
            grouped[category].sort((a, b) => a.name.localeCompare(b.name));
        }

        return grouped;
    },

    /**
     * Get total resource count
     */
    getTotalCount(groupedResources) {
        let total = 0;
        for (const category of Object.values(groupedResources)) {
            for (const resource of category) {
                total += resource.quantity;
            }
        }
        return total;
    }
};
