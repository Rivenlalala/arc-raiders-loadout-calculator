import { useState } from 'react';
import { LoadoutBuilder } from './components/LoadoutBuilder/LoadoutBuilder';
import { ResourceTree } from './components/Calculator/ResourceTree';
import type { Loadout } from './types';

const emptyLoadout: Loadout = {
  weapon1: null,
  weapon2: null,
  augment: null,
  shield: null,
  healing: [],
  utilities: [],
  grenades: [],
  ammo: [],
};

function App() {
  const [loadout, setLoadout] = useState<Loadout>(emptyLoadout);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Arc Raiders Loadout Calculator
          </h1>
          <p className="text-sm text-muted-foreground">
            Plan your loadout and calculate required resources
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Loadout Builder */}
          <div className="bg-card/30 rounded-xl p-6 border border-border">
            <LoadoutBuilder loadout={loadout} onChange={setLoadout} />
          </div>

          {/* Right: Resource Calculator */}
          <div className="bg-card/30 rounded-xl p-6 border border-border">
            <ResourceTree loadout={loadout} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Data scraped from{' '}
            <a
              href="https://arcraiders.wiki"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              arcraiders.wiki
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
