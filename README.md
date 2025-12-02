# Arc Raiders Loadout Calculator

A web-based tool to calculate the resources needed for your custom loadout in Arc Raiders.

## Features

- **Loadout Configuration**: Select augments, shields, weapons (with tier selection), ammo, utilities, grenades, and healing items
- **Weapon Modifications**: Choose mods for each weapon slot
- **Real-time Calculation**: Resources update automatically as you configure your loadout
- **Resource Breakdown**: Materials grouped by category (Base, Refined, Gun Parts, ARC Materials, Special)

## Live Demo

Visit: `https://YOUR_USERNAME.github.io/arc-raiders-loadout-calculator/`

## Hosting on GitHub Pages

1. Push this repository to GitHub
2. Go to repository Settings > Pages
3. Set Source to "Deploy from a branch"
4. Select `main` branch and `/docs` folder
5. Save and wait for deployment

## Project Structure

```
arc-raiders-loadout-calculator/
├── docs/                    # GitHub Pages site
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── data.js          # Game data (auto-generated)
│       ├── gameData.js      # Data access layer
│       ├── calculator.js    # Resource calculation logic
│       └── app.js           # Main application
├── data/
│   └── game_data.json       # Consolidated game data
└── scraper/                 # Data scraping tools
    ├── weapon_scraper.py
    ├── equipment_scraper.py
    ├── modifications_scraper.py
    ├── materials_scraper.py
    └── consolidate_data.py
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

# Consolidate and generate JS
python consolidate_data.py
cd ..
cat data/game_data.json | python3 -c "import sys, json; data = json.load(sys.stdin); print('const GAME_DATA = ' + json.dumps(data, indent=2) + ';')" > docs/js/data.js
```

## Data Sources

All game data is scraped from [arcraiders.wiki](https://arcraiders.wiki).

## License

MIT License - Feel free to use and modify.
