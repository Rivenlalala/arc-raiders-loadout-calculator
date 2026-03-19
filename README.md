# Arc Raiders Loadout Calculator

Plan your loadout and calculate the crafting materials you need in [Arc Raiders](https://www.playanvil.com/games/arc-raiders).

**[Try it live at arc-calculator.xyz](https://arc-calculator.xyz/)**

## Features

- Build full loadouts — weapons, augments, shields, consumables, and ammo
- Weapon tier upgrades and modification slot selection
- Real-time crafting resource tree with expandable material breakdowns
- Stash Check — input your inventory to see what you still need
- Raid Prep — plan materials for multiple loadout rounds
- Shareable loadout URLs with lz-string compression
- English and Simplified Chinese (中文) language support
- Responsive design for desktop and mobile

## Tech Stack

- React 19, TypeScript, Vite 7, Tailwind CSS v4
- Game data from [RaidTheory/arcraiders-data](https://github.com/RaidTheory/arcraiders-data)
- Deployed on Cloudflare Pages

## Getting Started

```bash
cd app
npm install
npm run dev
```

## Updating Game Data

```bash
cd app
npm update arcraiders-data
npm run build
```

## Contributing

Contributions are welcome. See [CLAUDE.md](CLAUDE.md) for architecture details, code patterns, and development guidelines.

## Data Attribution

Game data provided by [RaidTheory/arcraiders-data](https://github.com/RaidTheory/arcraiders-data) and [arctracker.io](https://arctracker.io). All game content is copyright Embark Studios AB.

## License

MIT
