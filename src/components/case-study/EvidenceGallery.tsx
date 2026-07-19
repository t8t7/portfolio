import type { IspringMediaItem } from '@/data/ispringMedia';
import { Stagger, StaggerItem } from '@/components/common/Reveal';
import { cn } from '@/utils';

interface EvidenceGalleryProps {
  items: IspringMediaItem[];
  allItems: IspringMediaItem[];
  onOpen: (globalIndex: number) => void;
  getAlt: (fileName: string) => string;
  className?: string;
}

export function EvidenceGallery({
  items,
  allItems,
  onOpen,
  getAlt,
  className,
}: EvidenceGalleryProps) {
  if (items.length === 0) return null;

  return (
    <Stagger className={cn('grid gap-4 sm:grid-cols-2', className)}>
      {items.map((item) => {
        const globalIndex = allItems.findIndex((entry) => entry.id === item.id);

        return (
          <StaggerItem key={item.id}>
            <button
              type="button"
              onClick={() => onOpen(globalIndex >= 0 ? globalIndex : 0)}
              className="group block w-full cursor-pointer overflow-hidden rounded-md border border-ink-line bg-ink/50 shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-transform duration-300 ease-out hover:scale-[1.025] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <img
                src={item.src}
                alt={getAlt(item.fileName)}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover object-top transition-opacity duration-300 group-hover:opacity-95"
              />
            </button>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
