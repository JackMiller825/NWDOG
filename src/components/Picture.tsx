import type { ImgHTMLAttributes } from 'react';

interface PictureProps {
  avif?: string;
  webp?: string;
  fallback: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function Picture({ avif, webp, fallback, alt, width, height, priority = false, className }: PictureProps) {
  const loading: ImgHTMLAttributes<HTMLImageElement>['loading'] = priority ? 'eager' : 'lazy';
  return (
    <picture>
      {avif ? <source srcSet={avif} type="image/avif" /> : null}
      {webp ? <source srcSet={webp} type="image/webp" /> : null}
      <img
        className={className}
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
}
