import { WeaponSelector } from './WeaponSelector';
import { ItemSelector } from '../ui/ItemSelector';
import { getAugments, getShields, getHealing, getGrenades, getQuickUse } from '../../data/gameData';
import type { Loadout } from '../../types';

interface LoadoutBuilderProps {
  loadout: Loadout;
  onChange: (loadout: Loadout) => void;
}

export function LoadoutBuilder({ loadout, onChange }: LoadoutBuilderProps) {
  const augments = getAugments();
  const shields = getShields();
  const healing = getHealing().filter(h => h.crafting.materials.length > 0);
  const grenades = getGrenades().filter(g => g.crafting.materials.length > 0);
  const utilities = getQuickUse().filter(u => u.crafting.materials.length > 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Loadout Builder</h2>

      {/* Weapons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <WeaponSelector
            label="Primary Weapon"
            value={loadout.weapon1}
            onChange={(weapon) => onChange({ ...loadout, weapon1: weapon })}
          />
        </div>
        <div className="relative">
          <WeaponSelector
            label="Secondary Weapon"
            value={loadout.weapon2}
            onChange={(weapon) => onChange({ ...loadout, weapon2: weapon })}
          />
        </div>
      </div>

      {/* Augment & Shield */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ItemSelector
          title="Augment"
          items={augments.map(a => ({
            id: a.id,
            name: a.name,
            image: a.image,
            rarity: a.rarity,
          }))}
          selectedId={loadout.augment}
          onSelect={(id) => onChange({ ...loadout, augment: id })}
        />
        <ItemSelector
          title="Shield"
          items={shields.map(s => ({
            id: s.id,
            name: s.name,
            image: s.image,
            rarity: s.rarity,
          }))}
          selectedId={loadout.shield}
          onSelect={(id) => onChange({ ...loadout, shield: id })}
        />
      </div>

      {/* Consumables */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Consumables</h3>

        {/* Healing */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Healing Items
          </label>
          <div className="flex flex-wrap gap-2">
            {healing.map((item) => {
              const current = loadout.healing.find(h => h.id === item.id);
              const qty = current?.quantity ?? 0;

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`relative cursor-pointer ${qty > 0 ? 'ring-2 ring-primary rounded-lg' : ''}`}
                    onClick={() => {
                      const newHealing = loadout.healing.filter(h => h.id !== item.id);
                      if (qty === 0) {
                        newHealing.push({ id: item.id, quantity: 1 });
                      }
                      onChange({ ...loadout, healing: newHealing });
                    }}
                  >
                    <img
                      src={`/${item.image}`}
                      alt={item.name}
                      className="w-12 h-12 object-contain"
                    />
                    {qty > 0 && (
                      <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded px-1">
                        {qty}
                      </span>
                    )}
                  </div>
                  {qty > 0 && (
                    <div className="flex items-center gap-1">
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newHealing = loadout.healing.map(h =>
                            h.id === item.id ? { ...h, quantity: Math.max(0, h.quantity - 1) } : h
                          ).filter(h => h.quantity > 0);
                          onChange({ ...loadout, healing: newHealing });
                        }}
                      >
                        -
                      </button>
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newHealing = loadout.healing.map(h =>
                            h.id === item.id ? { ...h, quantity: h.quantity + 1 } : h
                          );
                          onChange({ ...loadout, healing: newHealing });
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground truncate max-w-[60px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grenades */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Grenades
          </label>
          <div className="flex flex-wrap gap-2">
            {grenades.map((item) => {
              const current = loadout.grenades.find(g => g.id === item.id);
              const qty = current?.quantity ?? 0;

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`relative cursor-pointer ${qty > 0 ? 'ring-2 ring-primary rounded-lg' : ''}`}
                    onClick={() => {
                      const newGrenades = loadout.grenades.filter(g => g.id !== item.id);
                      if (qty === 0) {
                        newGrenades.push({ id: item.id, quantity: 1 });
                      }
                      onChange({ ...loadout, grenades: newGrenades });
                    }}
                  >
                    <img
                      src={`/${item.image}`}
                      alt={item.name}
                      className="w-12 h-12 object-contain"
                    />
                    {qty > 0 && (
                      <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded px-1">
                        {qty}
                      </span>
                    )}
                  </div>
                  {qty > 0 && (
                    <div className="flex items-center gap-1">
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newGrenades = loadout.grenades.map(g =>
                            g.id === item.id ? { ...g, quantity: Math.max(0, g.quantity - 1) } : g
                          ).filter(g => g.quantity > 0);
                          onChange({ ...loadout, grenades: newGrenades });
                        }}
                      >
                        -
                      </button>
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newGrenades = loadout.grenades.map(g =>
                            g.id === item.id ? { ...g, quantity: g.quantity + 1 } : g
                          );
                          onChange({ ...loadout, grenades: newGrenades });
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground truncate max-w-[60px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Utilities */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Utilities
          </label>
          <div className="flex flex-wrap gap-2">
            {utilities.map((item) => {
              const current = loadout.utilities.find(u => u.id === item.id);
              const qty = current?.quantity ?? 0;

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`relative cursor-pointer ${qty > 0 ? 'ring-2 ring-primary rounded-lg' : ''}`}
                    onClick={() => {
                      const newUtilities = loadout.utilities.filter(u => u.id !== item.id);
                      if (qty === 0) {
                        newUtilities.push({ id: item.id, quantity: 1 });
                      }
                      onChange({ ...loadout, utilities: newUtilities });
                    }}
                  >
                    <img
                      src={`/${item.image}`}
                      alt={item.name}
                      className="w-12 h-12 object-contain"
                    />
                    {qty > 0 && (
                      <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded px-1">
                        {qty}
                      </span>
                    )}
                  </div>
                  {qty > 0 && (
                    <div className="flex items-center gap-1">
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newUtilities = loadout.utilities.map(u =>
                            u.id === item.id ? { ...u, quantity: Math.max(0, u.quantity - 1) } : u
                          ).filter(u => u.quantity > 0);
                          onChange({ ...loadout, utilities: newUtilities });
                        }}
                      >
                        -
                      </button>
                      <button
                        className="w-5 h-5 bg-secondary rounded text-xs hover:bg-secondary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newUtilities = loadout.utilities.map(u =>
                            u.id === item.id ? { ...u, quantity: u.quantity + 1 } : u
                          );
                          onChange({ ...loadout, utilities: newUtilities });
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground truncate max-w-[60px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
