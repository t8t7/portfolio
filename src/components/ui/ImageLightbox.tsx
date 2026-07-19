import { useCallback, useEffect, useRef, useState, type PointerEvent, type WheelEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';

export interface LightboxImage {
  src: string;
  alt: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

export function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const { t } = useTranslation();
  const open = index !== null && images.length > 0;
  const current = open && index !== null ? images[index] : null;

  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [viewIndex, setViewIndex] = useState(index);
  const draggingRef = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const didSwipeNav = useRef(false);

  // Reset zoom/pan when the active page changes (React "adjust state during render").
  if (index !== viewIndex) {
    setViewIndex(index);
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
    setIsDragging(false);
  }

  const resetView = useCallback(() => {
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
    setIsDragging(false);
    draggingRef.current = false;
  }, []);

  const goPrev = useCallback(() => {
    if (index === null || images.length === 0) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [images.length, index, onIndexChange]);

  const goNext = useCallback(() => {
    if (index === null || images.length === 0) return;
    onIndexChange((index + 1) % images.length);
  }, [images.length, index, onIndexChange]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
      if (event.key === '+' || event.key === '=') {
        setZoom((value) => Math.min(MAX_ZOOM, value + ZOOM_STEP));
      }
      if (event.key === '-') {
        setZoom((value) => Math.max(MIN_ZOOM, value - ZOOM_STEP));
      }
      if (event.key === '0') resetView();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose, goPrev, goNext, resetView]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    didSwipeNav.current = false;
    swipeStart.current = { x: event.clientX, y: event.clientY };

    if (zoom <= MIN_ZOOM) return;
    draggingRef.current = true;
    setIsDragging(true);
    lastPoint.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || zoom <= MIN_ZOOM) return;
    const dx = event.clientX - lastPoint.current.x;
    const dy = event.clientY - lastPoint.current.y;
    lastPoint.current = { x: event.clientX, y: event.clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    setIsDragging(false);

    if (
      zoom <= MIN_ZOOM &&
      images.length > 1 &&
      swipeStart.current &&
      !didSwipeNav.current
    ) {
      const dx = event.clientX - swipeStart.current.x;
      const dy = event.clientY - swipeStart.current.y;
      const SWIPE_THRESHOLD = 56;

      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.2) {
        didSwipeNav.current = true;
        if (dx < 0) goNext();
        else goPrev();
      }
    }

    swipeStart.current = null;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      setZoom((value) => Math.min(MAX_ZOOM, Number((value + ZOOM_STEP).toFixed(2))));
    } else {
      setZoom((value) => {
        const next = Math.max(MIN_ZOOM, Number((value - ZOOM_STEP).toFixed(2)));
        if (next === MIN_ZOOM) setOffset({ x: 0, y: 0 });
        return next;
      });
    }
  };

  if (typeof document === 'undefined') return null;

  const closeLabel = t('caseStudy.lightboxClose');
  const prevLabel = t('caseStudy.lightboxPrev');
  const nextLabel = t('caseStudy.lightboxNext');

  return createPortal(
    <AnimatePresence>
      {open && current ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            aria-label={closeLabel}
            className="absolute inset-0 bg-ink/90 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            className="relative z-10 flex h-full max-h-[92vh] w-full max-w-6xl flex-col"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <p className="truncate text-xs tracking-[0.16em] text-fog uppercase">
                {index !== null ? `${index + 1} / ${images.length}` : ''}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-ink-line text-fog transition-colors hover:border-accent/40 hover:text-accent-soft"
                aria-label={closeLabel}
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label={prevLabel}
                    className="absolute top-1/2 left-0 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border border-ink-line bg-ink-soft/90 text-chalk transition-colors hover:border-accent/40 hover:text-accent-soft sm:left-2"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label={nextLabel}
                    className="absolute top-1/2 right-0 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border border-ink-line bg-ink-soft/90 text-chalk transition-colors hover:border-accent/40 hover:text-accent-soft sm:right-2"
                  >
                    ›
                  </button>
                </>
              ) : null}

              <div
                className={cn(
                  'flex h-full items-center justify-center overflow-hidden rounded-sm border border-ink-line bg-ink/70',
                  zoom > MIN_ZOOM ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
                )}
                onWheel={onWheel}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                <img
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  draggable={false}
                  className="max-h-[min(78vh,860px)] max-w-full select-none object-contain"
                  style={{
                    transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.18s ease',
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
