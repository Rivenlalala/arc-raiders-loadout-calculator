/**
 * Game Data Module
 * Provides access to Arc Raiders game data (loaded from data.js)
 */

const GameData = {
    data: GAME_DATA, // Loaded from data.js
    loaded: true,

    async load() {
        // Data is already loaded from data.js
        console.log('Game data loaded successfully');
        return true;
    },

    getWeapons() {
        return this.data?.weapons || [];
    },

    getWeaponById(id) {
        return this.getWeapons().find(w => w.id === id);
    },

    getWeaponByName(name) {
        return this.getWeapons().find(w => w.name.toLowerCase() === name.toLowerCase());
    },

    getAugments() {
        return this.data?.equipment?.augments || [];
    },

    getShields() {
        return this.data?.equipment?.shields || [];
    },

    getHealing() {
        return this.data?.equipment?.healing || [];
    },

    getQuickUse() {
        return this.data?.equipment?.quick_use || [];
    },

    getGrenades() {
        return this.data?.equipment?.grenades || [];
    },

    getTraps() {
        return this.data?.equipment?.traps || [];
    },

    getModifications() {
        return this.data?.modifications || [];
    },

    getModificationsBySlot(slotType) {
        return this.getModifications().filter(m =>
            m.slot_type?.toLowerCase() === slotType.toLowerCase()
        );
    },

    getMaterials() {
        return this.data?.materials || [];
    },

    getAmmoTypes() {
        return this.data?.ammo || [];
    },

    getAmmoByType(ammoType) {
        const normalized = ammoType.toLowerCase().replace(/\s+/g, '_');
        return this.getAmmoTypes().find(a => a.id === normalized);
    },

    getItemById(category, id) {
        const categoryMap = {
            'augments': this.getAugments(),
            'shields': this.getShields(),
            'healing': this.getHealing(),
            'quick_use': this.getQuickUse(),
            'grenades': this.getGrenades(),
            'traps': this.getTraps(),
            'modifications': this.getModifications()
        };

        const items = categoryMap[category] || [];
        return items.find(item => item.id === id);
    }
};
