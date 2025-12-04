# Arc Raiders Loadout Calculator

A web-based tool to plan your loadout and calculate the resources needed in Arc Raiders.

## Features

- **Loadout Builder**: Select weapons, augments, shields, and consumables
- **Weapon Modifications**: Choose mods for each weapon slot with tier selection
- **Consumables**: Healing items, grenades, utilities, and traps with quantity controls
- **Real-time Calculation**: Resource tree updates automatically as you configure
- **Material Breakdown**: Shows crafting hierarchy from final items down to base materials
- **Rarity Sorting**: Items sorted by rarity (Common to Legendary) with colored borders
- **Shareable Loadouts**: Generate compressed URLs to share your builds
- **Responsive Design**: Works on desktop and mobile

## Live Demo

[Cloudflare pages](https://arc-calculator.xyz/)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Hosting**: Cloudflare Pages
- **URL Compression**: lz-string for compact share URLs

## Project Structure

```
arc-raiders-loadout-calculator/
├── app/                        # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── LoadoutBuilder/ # Main loadout configuration
│   │   │   ├── Calculator/     # Resource calculation display
│   │   │   └── ui/             # Reusable UI components
│   │   ├── data/               # Game data JSON
│   │   ├── utils/              # Utilities (share, etc.)
│   │   └── types/              # TypeScript types
│   ├── public/                 # Static assets (images)
│   └── wrangler.jsonc          # Cloudflare Pages config
├── data/
│   └── game_data.json          # Consolidated game data
└── scraper/                    # Data scraping tools
    ├── weapon_scraper.py
    ├── equipment_scraper.py
    ├── modifications_scraper.py
    ├── materials_scraper.py
    └── consolidate_data.py
```

## Development

```bash
cd app
npm install
npm run dev
```

## Building & Deployment

```bash
cd app
npm run build
npx wrangler pages deploy dist
```

## Updating Game Data

If game data changes, run the scrapers to update:

```bash
cd scraper
pip install requests beautifulsoup4 lxml

# Scrape all data
python weapon_scraper.py
python equipment_scraper.py
python modifications_scraper.py
python materials_scraper.py

# Consolidate into game_data.json
python consolidate_data.py

# Copy to app
cp ../data/game_data.json ../app/src/data/
```

## Data Sources

All game data is scraped from [arcraiders.wiki](https://arcraiders.wiki).

## License

MIT License - Feel free to use and modify.
