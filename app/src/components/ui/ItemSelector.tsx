import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ItemCard } from './ItemCard';

interface Item {
  id: string;
  name: string;
  image: string | null;
  rarity?: string | null;
  category?: string;
}

interface ItemSelectorProps {
  title: string;
  items: Item[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  showSearch?: boolean;
  className?: string;
}

export function ItemSelector({
  title,
  items,
  selectedId,
  onSelect,
  showSearch = true,
  className,
}: ItemSelectorProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className={cn('relative', className)}>
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        {title}
      </label>

      {/* Selected item display / trigger */}
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border border-border',
          'bg-card hover:bg-secondary/50 cursor-pointer transition-colors',
          isOpen && 'ring-2 ring-primary'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedItem ? (
          <>
            <ItemCard
              name={selectedItem.name}
              image={selectedItem.image}
              rarity={selectedItem.rarity}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{selectedItem.name}</p>
              {selectedItem.category && (
                <p className="text-sm text-muted-foreground">{selectedItem.category}</p>
              )}
            </div>
            <button
              className="p-1 hover:bg-secondary rounded"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <span className="text-muted-foreground">Select {title.toLowerCase()}...</span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-h-80 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
          {showSearch && (
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-secondary rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="overflow-y-auto max-h-60 p-2">
            <div className="grid grid-cols-4 gap-2">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  name={item.name}
                  image={item.image}
                  rarity={item.rarity}
                  selected={item.id === selectedId}
                  size="sm"
                  onClick={() => {
                    onSelect(item.id);
                    setIsOpen(false);
                    setSearch('');
                  }}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No items found</p>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setSearch('');
          }}
        />
      )}
    </div>
  );
}
