'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  height?: number;
  className?: string;
  overlay?: React.ReactNode;
}

export default function ImageCarousel({ images, height = 400, className, overlay }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index: number) => setActiveIndex(index);
  const goNext = () => setActiveIndex((i) => (i + 1) % images.length);
  const goPrev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);

  if (!images.length) return null;

  return (
    <div className={cn('relative overflow-hidden', className)} style={{ height }}>
      {/* Images */}
      <div className="relative h-full w-full">
        {images.map((src, i) => (
          <div
            key={i}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              i === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      {overlay && <div className="absolute inset-0">{overlay}</div>}

      {/* Nav buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                'rounded-full transition-all',
                i === activeIndex ? 'h-1.5 w-4 bg-white' : 'h-1.5 w-1.5 bg-white/40'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
