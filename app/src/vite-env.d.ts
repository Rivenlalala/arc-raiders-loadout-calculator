/// <reference types="vite/client" />

declare module 'virtual:arcraiders-items' {
  import type { RawGameItem } from './types';
  const items: RawGameItem[];
  export default items;
}

declare module 'virtual:arcraiders-hideout' {
  const hideout: Record<string, unknown>;
  export default hideout;
}
