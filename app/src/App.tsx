import { useState, useEffect } from 'react';
import { LoadoutBuilder } from './components/LoadoutBuilder/LoadoutBuilder';
import { ResourceTree } from './components/Calculator/ResourceTree';
import { getSharedLoadout, getShareUrl } from './utils/shareLoadout';
import type { Loadout } from './types';

const emptyLoadout: Loadout = {
  weapon1: null,
  weapon2: null,
  augment: null,
  shield: null,
  healing: [],
  utilities: [],
  grenades: [],
  traps: [],
  ammo: [],
};

function App() {
  const [loadout, setLoadout] = useState<Loadout>(() => {
    // Check for shared loadout in URL on initial load
    const shared = getSharedLoadout();
    return shared || emptyLoadout;
  });
  const [copied, setCopied] = useState(false);

  // Clear URL after loading shared loadout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('share')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleShare = async () => {
    const url = getShareUrl(loadout);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      prompt('Copy this URL to share your loadout:', url);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Arc Raiders Loadout Calculator
            </h1>
            <p className="text-sm text-muted-foreground">
              Plan your loadout and calculate required resources
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLoadout(emptyLoadout)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </>
              )}
            </button>
          </div>
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
          <p className="mt-2">
            Found a bug?{' '}
            <a
              href="https://github.com/Rivenlalala/arc-raiders-loadout-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Contribute on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
