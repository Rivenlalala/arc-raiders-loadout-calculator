import type { Loadout, LoadoutWeapon, LoadoutItem } from '../types';

// Compact format for URL encoding
interface CompactLoadout {
  w1?: { i: string; t: number; m: string[] } | null;
  w2?: { i: string; t: number; m: string[] } | null;
  a?: string | null;
  s?: string | null;
  h?: { i: string; q: number }[];
  u?: { i: string; q: number }[];
  g?: { i: string; q: number }[];
  t?: { i: string; q: number }[];
  am?: { t: string; q: number }[];
}

function compactWeapon(weapon: LoadoutWeapon | null): CompactLoadout['w1'] {
  if (!weapon) return null;
  return { i: weapon.id, t: weapon.tier, m: weapon.mods };
}

function expandWeapon(compact: CompactLoadout['w1']): LoadoutWeapon | null {
  if (!compact) return null;
  return { id: compact.i, tier: compact.t, mods: compact.m };
}

function compactItems(items: LoadoutItem[]): { i: string; q: number }[] {
  return items.map(item => ({ i: item.id, q: item.quantity }));
}

function expandItems(compact: { i: string; q: number }[] | undefined): LoadoutItem[] {
  if (!compact) return [];
  return compact.map(c => ({ id: c.i, quantity: c.q }));
}

function compactAmmo(ammo: { type: string; quantity: number }[]): { t: string; q: number }[] {
  return ammo.map(a => ({ t: a.type, q: a.quantity }));
}

function expandAmmo(compact: { t: string; q: number }[] | undefined): { type: string; quantity: number }[] {
  if (!compact) return [];
  return compact.map(c => ({ type: c.t, quantity: c.q }));
}

export function encodeLoadout(loadout: Loadout): string {
  // Create compact representation, omitting empty arrays
  const compact: CompactLoadout = {};

  if (loadout.weapon1) compact.w1 = compactWeapon(loadout.weapon1);
  if (loadout.weapon2) compact.w2 = compactWeapon(loadout.weapon2);
  if (loadout.augment) compact.a = loadout.augment;
  if (loadout.shield) compact.s = loadout.shield;
  if (loadout.healing.length > 0) compact.h = compactItems(loadout.healing);
  if (loadout.utilities.length > 0) compact.u = compactItems(loadout.utilities);
  if (loadout.grenades.length > 0) compact.g = compactItems(loadout.grenades);
  if (loadout.traps.length > 0) compact.t = compactItems(loadout.traps);
  if (loadout.ammo.length > 0) compact.am = compactAmmo(loadout.ammo);

  // Convert to JSON and encode as URL-safe base64
  const json = JSON.stringify(compact);
  const base64 = btoa(json);
  // Make URL-safe: replace + with -, / with _, remove padding =
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeLoadout(encoded: string): Loadout | null {
  try {
    // Restore standard base64: replace - with +, _ with /
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }

    const json = atob(base64);
    const compact: CompactLoadout = JSON.parse(json);

    return {
      weapon1: expandWeapon(compact.w1),
      weapon2: expandWeapon(compact.w2),
      augment: compact.a || null,
      shield: compact.s || null,
      healing: expandItems(compact.h),
      utilities: expandItems(compact.u),
      grenades: expandItems(compact.g),
      traps: expandItems(compact.t),
      ammo: expandAmmo(compact.am),
    };
  } catch (e) {
    console.error('Failed to decode loadout:', e);
    return null;
  }
}

export function getShareUrl(loadout: Loadout): string {
  const encoded = encodeLoadout(loadout);
  const url = new URL(window.location.href);
  url.search = `?share=${encoded}`;
  return url.toString();
}

export function getSharedLoadout(): Loadout | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('share');
  if (!encoded) return null;
  return decodeLoadout(encoded);
}
