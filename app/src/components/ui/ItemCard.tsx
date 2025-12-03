import { cn } from '../../lib/utils';
import { getRarityColor } from '../../data/gameData';

interface ItemCardProps {
  name: string;
  image: string | null;
  rarity?: string | null;
  selected?: boolean;
  onClick?: () => void;
  subtitle?: string;
  quantity?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function ItemCard({
  name,
  image,
  rarity,
  selected = false,
  onClick,
  subtitle,
  quantity,
  size = 'md',
  className,
}: ItemCardProps) {
  const rarityColor = getRarityColor(rarity ?? null);

  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const imageSizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg p-2 transition-all duration-200',
        'bg-gradient-to-br from-card to-secondary/50',
        'border-2',
        onClick && 'cursor-pointer hover:scale-105 hover:shadow-lg',
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        sizeClasses[size],
        className
      )}
      style={{
        borderColor: rarityColor,
        boxShadow: selected ? `0 0 12px ${rarityColor}` : undefined
      }}
      onClick={onClick}
    >
      {image ? (
        <img
          src={`/${image}`}
          alt={name}
          className={cn('object-contain', imageSizeClasses[size])}
          loading="lazy"
        />
      ) : (
        <div className={cn('bg-muted rounded flex items-center justify-center text-muted-foreground text-xs', imageSizeClasses[size])}>
          No img
        </div>
      )}

      {quantity !== undefined && quantity > 1 && (
        <span className="absolute bottom-1 right-1 bg-primary text-primary-foreground text-xs font-bold rounded px-1">
          x{quantity}
        </span>
      )}

      {size !== 'xs' && size !== 'sm' && (
        <div className="mt-1 text-center">
          <p className="text-xs font-medium truncate w-full" title={name}>
            {name}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
