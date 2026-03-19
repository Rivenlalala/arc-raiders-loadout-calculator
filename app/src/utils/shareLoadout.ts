import LZString from 'lz-string';
import type { Loadout, LoadoutWeapon, LoadoutItem } from '../types';

interface CompactLoadout {
  w1?: { i: string; m: string[] } | null;
  w2?: { i: string; m: string[] } | null;
  a?: string | null;
  s?: string | null;
  h?: { i: string; q: number }[];
  u?: { i: string; q: number }[];
  g?: { i: string; q: number }[];
  t?: { i: string; q: number }[];
  am?: { t: string; q: number }[];
}

function compactWeapon(w: LoadoutWeapon | null): { i: string; m: string[] } | null {
  if (!w) return null;
  return { i: w.id, m: w.mods.filter(Boolean) };
}

function expandWeapon(w: { i: string; m: string[] } | null | undefined): LoadoutWeapon | null {
  if (!w) return null;
  return { id: w.i, mods: w.m || [] };
}

function compactItems(items: LoadoutItem[]): { i: string; q: number }[] {
  return items.filter(item => item.quantity > 0).map(item => ({ i: item.id, q: item.quantity }));
}

function expandItems(items: { i: string; q: number }[] | undefined): LoadoutItem[] {
  if (!items) return [];
  return items.map(item => ({ id: item.i, quantity: item.q }));
}

export function encodeLoadout(loadout: Loadout): string {
  const compact: CompactLoadout = {
    w1: compactWeapon(loadout.weapon1),
    w2: compactWeapon(loadout.weapon2),
    a: loadout.augment,
    s: loadout.shield,
    h: compactItems(loadout.healing),
    u: compactItems(loadout.utilities),
    g: compactItems(loadout.grenades),
    t: compactItems(loadout.traps),
    am: loadout.ammo.filter(a => a.quantity > 0).map(a => ({ t: a.type, q: a.quantity })),
  };

  const json = JSON.stringify(compact);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeLoadout(encoded: string): Loadout | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;

    const compact = JSON.parse(json) as CompactLoadout;

    return {
      weapon1: expandWeapon(compact.w1),
      weapon2: expandWeapon(compact.w2),
      augment: compact.a ?? null,
      shield: compact.s ?? null,
      healing: expandItems(compact.h),
      utilities: expandItems(compact.u),
      grenades: expandItems(compact.g),
      traps: expandItems(compact.t),
      ammo: (compact.am || []).map(a => ({ type: a.t, quantity: a.q })),
    };
  } catch {
    return null;
  }
}

export function getShareUrl(loadout: Loadout): string {
  const encoded = encodeLoadout(loadout);
  const url = new URL(window.location.href);
  url.searchParams.set('share', encoded);
  return url.toString();
}

export function getSharedLoadout(): Loadout | null {
  const url = new URL(window.location.href);
  const encoded = url.searchParams.get('share');
  if (!encoded) return null;

  const loadout = decodeLoadout(encoded);
  if (loadout) {
    url.searchParams.delete('share');
    window.history.replaceState({}, '', url.toString());
  }
  return loadout;
}
