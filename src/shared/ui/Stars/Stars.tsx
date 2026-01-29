import { Star } from 'lucide-react';

import { clampRating } from '@/entities/review';
import { cx } from '@/shared/lib';

type StarsSize = 'sm' | 'md';

type StarsProps = {
  value: number;
  size?: StarsSize;
};

export default function Stars({ value, size = 'md' }: StarsProps) {
  const v = clampRating(value);
  const full = Math.max(0, Math.min(5, Math.round(v)));
  const empty = 5 - full;

  const iconClass = cx(size === 'sm' ? 'h-4 w-4' : 'h-4 w-4', 'text-lime-600');
  const filledClass = cx(iconClass, 'fill-lime-600');

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} className={filledClass} />
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} className={cx(iconClass, 'text-gray-300')} />
      ))}
    </div>
  );
}
