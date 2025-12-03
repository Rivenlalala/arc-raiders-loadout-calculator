# Arc Raiders Loadout Calculator - Frontend

React application for the Arc Raiders Loadout Calculator.

## Quick Start

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

Deploy to Cloudflare Pages:

```bash
npm run build
npx wrangler pages deploy dist
```

Configuration is in `wrangler.jsonc`.

## Project Structure

```
src/
├── components/
│   ├── LoadoutBuilder/     # Loadout configuration
│   │   ├── LoadoutBuilder.tsx
│   │   └── WeaponSelector.tsx
│   ├── Calculator/         # Resource display
│   │   └── ResourceTree.tsx
│   └── ui/                 # Reusable components
│       └── ItemCard.tsx
├── data/
│   ├── game_data.json      # Game data (copy from ../data/)
│   └── gameData.ts         # Data access functions
├── hooks/
│   └── useIsMobile.ts
├── utils/
│   └── shareLoadout.ts     # URL encoding with lz-string
├── types/
│   └── index.ts            # TypeScript interfaces
├── App.tsx                 # Main application
└── main.tsx               # Entry point
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- lz-string (URL compression)
