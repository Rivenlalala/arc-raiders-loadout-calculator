/**
 * Resource Calculator Module
 * Calculates total resources needed for a loadout
 */

const Calculator = {
    /**
     * Calculate resources for a complete loadout
     */
    calculateLoadout(loadout) {
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

        return this.groupResources(resources);
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
