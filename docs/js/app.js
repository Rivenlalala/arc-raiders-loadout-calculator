/**
 * Arc Raiders Loadout Calculator - Main Application
 */

const App = {
    // Current loadout state
    loadout: {
        augment: null,
        shield: null,
        weapon1: null,
        weapon2: null,
        utilities: [],
        grenades: [],
        healing: [],
        ammo: [],
        mods: []
    },

    async init() {
        // Load game data
        const loaded = await GameData.load();
        if (!loaded) {
            alert('Failed to load game data. Please refresh the page.');
            return;
        }

        // Populate dropdowns
        this.populateDropdowns();

        // Setup event listeners
        this.setupEventListeners();

        // Initial calculation
        this.updateResults();
    },

    populateDropdowns() {
        // Populate augment select
        const augmentSelect = document.getElementById('augment-select');
        this.populateSelect(augmentSelect, GameData.getAugments());

        // Populate shield select
        const shieldSelect = document.getElementById('shield-select');
        this.populateSelect(shieldSelect, GameData.getShields());

        // Populate weapon selects
        const weapon1Select = document.getElementById('weapon1-select');
        const weapon2Select = document.getElementById('weapon2-select');
        const weapons = GameData.getWeapons();
        this.populateSelect(weapon1Select, weapons);
        this.populateSelect(weapon2Select, weapons);

        // Populate utility select
        const utilitySelect = document.getElementById('utility-select');
        this.populateSelect(utilitySelect, GameData.getQuickUse());

        // Populate grenade select
        const grenadeSelect = document.getElementById('grenade-select');
        this.populateSelect(grenadeSelect, GameData.getGrenades());

        // Populate healing select
        const healingSelect = document.getElementById('healing-select');
        this.populateSelect(healingSelect, GameData.getHealing());

        // Populate ammo list
        this.populateAmmoList();
    },

    populateSelect(select, items) {
        // Keep the first option (placeholder)
        while (select.options.length > 1) {
            select.remove(1);
        }

        for (const item of items) {
            // Skip items without crafting materials (can't be crafted)
            if (!item.crafting?.materials?.length) continue;

            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            if (item.rarity) {
                option.className = `rarity-${item.rarity.toLowerCase()}`;
            }
            select.appendChild(option);
        }
    },

    populateAmmoList() {
        const ammoList = document.getElementById('ammo-list');
        ammoList.innerHTML = '';

        const ammoTypes = GameData.getAmmoTypes();
        for (const ammo of ammoTypes) {
            const div = document.createElement('div');
            div.className = 'ammo-item';
            div.innerHTML = `
                <span>${ammo.name}</span>
                <input type="number" id="ammo-${ammo.id}" value="0" min="0" max="500" step="10">
            `;
            ammoList.appendChild(div);
        }

        // Add event listeners to ammo inputs
        for (const ammo of ammoTypes) {
            const input = document.getElementById(`ammo-${ammo.id}`);
            input.addEventListener('change', () => this.updateAmmo());
            input.addEventListener('input', () => this.updateAmmo());
        }
    },

    setupEventListeners() {
        // Augment change
        document.getElementById('augment-select').addEventListener('change', (e) => {
            this.loadout.augment = e.target.value ?
                GameData.getItemById('augments', e.target.value) : null;
            this.updateResults();
        });

        // Shield change
        document.getElementById('shield-select').addEventListener('change', (e) => {
            this.loadout.shield = e.target.value ?
                GameData.getItemById('shields', e.target.value) : null;
            this.updateResults();
        });

        // Weapon 1 changes
        document.getElementById('weapon1-select').addEventListener('change', (e) => {
            this.updateWeapon(1, e.target.value);
        });
        document.getElementById('weapon1-tier').addEventListener('change', (e) => {
            if (this.loadout.weapon1) {
                this.loadout.weapon1.tier = parseInt(e.target.value);
                this.updateResults();
            }
        });

        // Weapon 2 changes
        document.getElementById('weapon2-select').addEventListener('change', (e) => {
            this.updateWeapon(2, e.target.value);
        });
        document.getElementById('weapon2-tier').addEventListener('change', (e) => {
            if (this.loadout.weapon2) {
                this.loadout.weapon2.tier = parseInt(e.target.value);
                this.updateResults();
            }
        });

        // Add utility button
        document.getElementById('add-utility-btn').addEventListener('click', () => {
            this.addItem('utility', 'quick_use', 'utilities');
        });

        // Add grenade button
        document.getElementById('add-grenade-btn').addEventListener('click', () => {
            this.addItem('grenade', 'grenades', 'grenades');
        });

        // Add healing button
        document.getElementById('add-healing-btn').addEventListener('click', () => {
            this.addItem('healing', 'healing', 'healing');
        });

        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearLoadout();
        });

        // Breakdown toggle
        document.getElementById('breakdown-toggle').addEventListener('change', () => {
            this.updateResults();
        });
    },

    updateWeapon(slot, weaponId) {
        const tierSelect = document.getElementById(`weapon${slot}-tier`);
        const modsContainer = document.getElementById(`weapon${slot}-mods`);

        if (!weaponId) {
            this.loadout[`weapon${slot}`] = null;
            modsContainer.innerHTML = '';
            this.updateResults();
            return;
        }

        const weapon = GameData.getWeaponById(weaponId);
        if (!weapon) return;

        // Check if weapon can be upgraded
        const maxTier = weapon.crafting?.upgrades?.length ?
            weapon.crafting.upgrades.length + 1 : 1;

        // Update tier options
        tierSelect.innerHTML = '';
        for (let i = 1; i <= Math.min(maxTier, 4); i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = ['I', 'II', 'III', 'IV'][i - 1];
            tierSelect.appendChild(option);
        }

        this.loadout[`weapon${slot}`] = {
            id: weaponId,
            tier: 1
        };

        // Populate modification slots
        this.populateWeaponMods(slot, weapon);

        this.updateResults();
    },

    populateWeaponMods(slot, weapon) {
        const modsContainer = document.getElementById(`weapon${slot}-mods`);
        modsContainer.innerHTML = '';

        if (!weapon.modification_slots?.length) {
            modsContainer.innerHTML = '<p class="no-mods">No modification slots</p>';
            return;
        }

        for (const slotType of weapon.modification_slots) {
            const div = document.createElement('div');
            div.className = 'mod-slot';

            const label = document.createElement('label');
            label.textContent = slotType;

            const select = document.createElement('select');
            select.id = `weapon${slot}-mod-${slotType.toLowerCase().replace(/[^a-z]/g, '')}`;
            select.innerHTML = `<option value="">-- None --</option>`;

            // Get compatible mods for this slot
            const mods = GameData.getModificationsBySlot(slotType);
            for (const mod of mods) {
                if (!mod.crafting?.materials?.length) continue;
                const option = document.createElement('option');
                option.value = mod.id;
                option.textContent = mod.name;
                select.appendChild(option);
            }

            select.addEventListener('change', () => this.updateMods());

            div.appendChild(label);
            div.appendChild(select);
            modsContainer.appendChild(div);
        }
    },

    updateMods() {
        // Collect all selected mods
        this.loadout.mods = [];

        for (const slot of [1, 2]) {
            const modsContainer = document.getElementById(`weapon${slot}-mods`);
            const selects = modsContainer.querySelectorAll('select');

            for (const select of selects) {
                if (select.value) {
                    const mod = GameData.getItemById('modifications', select.value);
                    if (mod) {
                        this.loadout.mods.push(mod);
                    }
                }
            }
        }

        this.updateResults();
    },

    addItem(selectPrefix, category, loadoutKey) {
        const select = document.getElementById(`${selectPrefix}-select`);
        const quantityInput = document.getElementById(`${selectPrefix}-quantity`);
        const container = document.getElementById(`selected-${loadoutKey}`);

        if (!select.value) return;

        const item = GameData.getItemById(category, select.value);
        if (!item) return;

        const quantity = parseInt(quantityInput.value) || 1;

        // Check if already added
        const existing = this.loadout[loadoutKey].find(u => u.item.id === item.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.loadout[loadoutKey].push({ item, quantity });
        }

        // Reset select
        select.value = '';
        quantityInput.value = 1;

        // Update display
        this.renderSelectedItems(loadoutKey, container);
        this.updateResults();
    },

    renderSelectedItems(loadoutKey, container) {
        container.innerHTML = '';

        for (const entry of this.loadout[loadoutKey]) {
            const div = document.createElement('div');
            div.className = 'selected-item';
            div.innerHTML = `
                <span class="quantity">${entry.quantity}x</span>
                <span>${entry.item.name}</span>
                <button class="remove-item" data-id="${entry.item.id}">&times;</button>
            `;

            div.querySelector('.remove-item').addEventListener('click', () => {
                this.loadout[loadoutKey] = this.loadout[loadoutKey].filter(
                    u => u.item.id !== entry.item.id
                );
                this.renderSelectedItems(loadoutKey, container);
                this.updateResults();
            });

            container.appendChild(div);
        }
    },

    updateAmmo() {
        this.loadout.ammo = [];

        const ammoTypes = GameData.getAmmoTypes();
        for (const ammo of ammoTypes) {
            const input = document.getElementById(`ammo-${ammo.id}`);
            const quantity = parseInt(input.value) || 0;
            if (quantity > 0) {
                this.loadout.ammo.push({
                    type: ammo.name,
                    quantity
                });
            }
        }

        this.updateResults();
    },

    updateResults() {
        const container = document.getElementById('results-container');

        // Check if loadout is empty
        if (this.isLoadoutEmpty()) {
            container.innerHTML = '<p class="no-items">Select items to see required resources</p>';
            return;
        }

        // Check if breakdown to base materials is enabled
        const breakdownEnabled = document.getElementById('breakdown-toggle').checked;

        // Calculate resources
        const resources = Calculator.calculateLoadout(this.loadout, breakdownEnabled);

        // Render results
        container.innerHTML = '';

        // Define category order
        const categoryOrder = [
            'Base Materials',
            'Refined Materials',
            'Gun Parts',
            'ARC Materials',
            'Special Materials',
            'Other Materials'
        ];

        for (const category of categoryOrder) {
            if (!resources[category]?.length) continue;

            const group = document.createElement('div');
            group.className = 'resource-group';

            const header = document.createElement('h4');
            header.textContent = category;
            group.appendChild(header);

            for (const resource of resources[category]) {
                const item = document.createElement('div');
                item.className = 'resource-item';
                item.innerHTML = `
                    <span class="resource-name">${resource.name}</span>
                    <span class="resource-quantity">${resource.quantity}</span>
                `;
                group.appendChild(item);
            }

            container.appendChild(group);
        }

        // Add total summary
        const totalCount = Calculator.getTotalCount(resources);
        if (totalCount > 0) {
            const summary = document.createElement('div');
            summary.className = 'total-summary';
            summary.innerHTML = `
                <h4>Total Items Needed</h4>
                <div class="resource-item">
                    <span class="resource-name">All Materials</span>
                    <span class="resource-quantity">${totalCount}</span>
                </div>
            `;
            container.appendChild(summary);
        }
    },

    isLoadoutEmpty() {
        return !this.loadout.augment &&
               !this.loadout.shield &&
               !this.loadout.weapon1 &&
               !this.loadout.weapon2 &&
               !this.loadout.utilities.length &&
               !this.loadout.grenades.length &&
               !this.loadout.healing.length &&
               !this.loadout.ammo.length &&
               !this.loadout.mods.length;
    },

    clearLoadout() {
        // Reset state
        this.loadout = {
            augment: null,
            shield: null,
            weapon1: null,
            weapon2: null,
            utilities: [],
            grenades: [],
            healing: [],
            ammo: [],
            mods: []
        };

        // Reset all selects
        document.getElementById('augment-select').value = '';
        document.getElementById('shield-select').value = '';
        document.getElementById('weapon1-select').value = '';
        document.getElementById('weapon2-select').value = '';
        document.getElementById('weapon1-tier').innerHTML = '<option value="1">I</option>';
        document.getElementById('weapon2-tier').innerHTML = '<option value="1">I</option>';
        document.getElementById('weapon1-mods').innerHTML = '';
        document.getElementById('weapon2-mods').innerHTML = '';
        document.getElementById('utility-select').value = '';
        document.getElementById('grenade-select').value = '';
        document.getElementById('healing-select').value = '';

        // Reset ammo inputs
        const ammoTypes = GameData.getAmmoTypes();
        for (const ammo of ammoTypes) {
            const input = document.getElementById(`ammo-${ammo.id}`);
            if (input) input.value = 0;
        }

        // Clear selected items lists
        document.getElementById('selected-utilities').innerHTML = '';
        document.getElementById('selected-grenades').innerHTML = '';
        document.getElementById('selected-healing').innerHTML = '';

        // Update results
        this.updateResults();
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
