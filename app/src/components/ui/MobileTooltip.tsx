import { useState, useRef, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsMobile } from '../../hooks/useIsMobile';

interface MobileTooltipProps {
  children: ReactNode;
  content: ReactNode;
  title?: string;
  borderColor?: string;
  disabled?: boolean;
}

export function MobileTooltip({
  children,
  content,
  title,
  borderColor,
  disabled = false,
}: MobileTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Calculate position for desktop tooltip
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return null;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 288; // w-72 = 18rem = 288px
    const tooltipHeight = 200; // estimated
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let top = trigger.top;
    let left = trigger.right + 8; // Default: right of trigger

    // If tooltip would go off right edge, position to the left
    if (left + tooltipWidth > viewport.width - 16) {
      left = trigger.left - tooltipWidth - 8;
    }

    // If tooltip would go off left edge, center below
    if (left < 16) {
      left = Math.max(16, trigger.left);
      top = trigger.bottom + 8;
    }

    // Adjust vertical position if it would go off bottom
    if (top + tooltipHeight > viewport.height - 16) {
      top = Math.max(16, viewport.height - tooltipHeight - 16);
    }

    // Adjust if it would go off top
    if (top < 16) {
      top = 16;
    }

    return { top, left };
  }, []);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when modal is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobile, isOpen]);

  // Calculate position when showing on desktop
  useEffect(() => {
    if (!isMobile && isHovered) {
      setPosition(calculatePosition());
    }
  }, [isMobile, isHovered, calculatePosition]);

  if (disabled) {
    return <>{children}</>;
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(true);
    }
  };

  // Handle touch for mobile - more reliable than click
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(true);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setPosition(calculatePosition());
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
      setPosition(null);
    }
  };

  const showTooltip = isMobile ? isOpen : (isHovered && position !== null);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer"
      >
        {children}
      </div>

      {showTooltip &&
        createPortal(
          isMobile ? (
            // Mobile: Bottom sheet modal
            <div className="fixed inset-0 z-[200] flex items-end justify-center">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />
              {/* Content */}
              <div
                className={cn(
                  'relative w-full max-w-lg max-h-[70vh] overflow-y-auto',
                  'bg-card rounded-t-2xl border-t-2 shadow-2xl',
                  'animate-in slide-in-from-bottom duration-200'
                )}
                style={{ borderColor: borderColor || 'var(--border)' }}
              >
                {/* Handle bar */}
                <div className="sticky top-0 bg-card pt-3 pb-2 px-4 border-b border-border">
                  <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-2" />
                  <div className="flex items-center justify-between">
                    {title && (
                      <h3
                        className="font-semibold text-lg"
                        style={{ color: borderColor }}
                      >
                        {title}
                      </h3>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-secondary rounded-full ml-auto"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {/* Tooltip content */}
                <div className="p-4">{content}</div>
              </div>
            </div>
          ) : (
            // Desktop: Floating tooltip near trigger (no animation)
            <div
              ref={tooltipRef}
              className="fixed z-[100] w-72 p-3 rounded-lg border bg-card shadow-xl pointer-events-none"
              style={{
                top: position?.top ?? 0,
                left: position?.left ?? 0,
                borderColor: borderColor || 'var(--border)',
              }}
            >
              {content}
            </div>
          ),
          document.body
        )}
    </>
  );
}
