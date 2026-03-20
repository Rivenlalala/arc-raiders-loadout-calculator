import { useState, useRef, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsMobile } from '../../hooks/useIsMobile';

// Global event to close all tooltips when a new one opens
const CLOSE_ALL_EVENT = 'mobile-tooltip-close-all';
let tooltipCounter = 0;

interface MobileTooltipProps {
  children: ReactNode;
  content: ReactNode;
  title?: string;
  borderColor?: string;
  disabled?: boolean;
  className?: string;
  scrollable?: boolean;
}

export function MobileTooltip({
  children,
  content,
  title,
  borderColor,
  disabled = false,
  className,
  scrollable = false,
}: MobileTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const instanceId = useRef(++tooltipCounter);
  const isMobile = useIsMobile();

  // Calculate position for desktop tooltip
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return null;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 420;
    const tooltipHeight = 200;
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let top = trigger.top;
    let left = trigger.right + 8;

    if (left + tooltipWidth > viewport.width - 16) {
      left = trigger.left - tooltipWidth - 8;
    }

    if (left < 16) {
      left = Math.max(16, trigger.left);
      top = trigger.bottom + 8;
    }

    if (top + tooltipHeight > viewport.height - 16) {
      top = Math.max(16, viewport.height - tooltipHeight - 16);
    }

    if (top < 16) {
      top = 16;
    }

    return { top, left };
  }, []);

  // Listen for global close event — close if another tooltip opened
  useEffect(() => {
    const handleCloseAll = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail !== instanceId.current) {
        setIsHovered(false);
        setPosition(null);
        setIsOpen(false);
      }
    };
    window.addEventListener(CLOSE_ALL_EVENT, handleCloseAll);
    return () => window.removeEventListener(CLOSE_ALL_EVENT, handleCloseAll);
  }, []);

  // Close on escape key
  useEffect(() => {
    if (!isOpen && !isHovered) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsHovered(false);
        setPosition(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isHovered]);

  // Prevent body scroll when modal is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobile, isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (leaveTimeout.current) {
        clearTimeout(leaveTimeout.current);
      }
    };
  }, []);

  // Broadcast close-all when this tooltip opens
  const broadcastOpen = useCallback(() => {
    window.dispatchEvent(new CustomEvent(CLOSE_ALL_EVENT, { detail: instanceId.current }));
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isMobile && scrollable) {
      e.stopPropagation();
      broadcastOpen();
      setIsOpen(true);
    }
  }, [isMobile, scrollable, broadcastOpen]);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      if (leaveTimeout.current) {
        clearTimeout(leaveTimeout.current);
        leaveTimeout.current = null;
      }
      broadcastOpen();
      setPosition(calculatePosition());
      setIsHovered(true);
    }
  }, [isMobile, broadcastOpen, calculatePosition]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      if (scrollable) {
        leaveTimeout.current = setTimeout(() => {
          setIsHovered(false);
          setPosition(null);
        }, 150);
      } else {
        setIsHovered(false);
        setPosition(null);
      }
    }
  }, [isMobile, scrollable]);

  if (disabled) {
    return <>{children}</>;
  }

  const showTooltip = isMobile ? isOpen : (isHovered && position !== null);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn('cursor-pointer', className)}
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
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
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
            // Desktop: Floating tooltip near trigger
            <div
              ref={tooltipRef}
              className={cn(
                'fixed z-[100] w-[420px] px-5 py-3 rounded-lg border bg-card shadow-xl',
                scrollable ? 'max-h-[600px] overflow-y-auto' : 'pointer-events-none'
              )}
              style={{
                top: position?.top ?? 0,
                left: position?.left ?? 0,
                borderColor: borderColor || 'var(--border)',
              }}
              onMouseEnter={scrollable ? handleMouseEnter : undefined}
              onMouseLeave={scrollable ? handleMouseLeave : undefined}
            >
              {content}
            </div>
          ),
          document.body
        )}
    </>
  );
}
